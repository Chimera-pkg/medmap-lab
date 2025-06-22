import React, { useState } from "react";
import { Upload, Button, message, Card, Space, Table, Progress, Alert, Modal } from "antd";
import { UploadOutlined, CloudUploadOutlined, FileExcelOutlined, FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { generateReportBlob } from "../../utils/generateReport";
import { buildHL7Message } from "../../utils/generateHl7";

interface PatientData {
  sampleReferenceNumber: string;
  patientName: string;
  dateOfBirth: string;
  sex: string;
  mrn: string;
  ethnicity: string;
  specimenType: string;
  physicianName: string;
  disease: string;
}

interface LabTestResult {
  sampleReferenceNumber: string;
  drugName: string;
  geneName: string;
  genoType: string;
  phenoType: string;
  drugResponseToxicity: string;
  drugResponseDosage: string;
  drugResponseEfficacy: string;
  evidence: string;
  clinicalAnnotation: string;
}

interface BatchUploadData {
  patientFile: File | null;
  labResultFile: File | null;
  patientData: PatientData[];
  labResultData: LabTestResult[];
  matchedData: any[];
  validationErrors: string[];
  uploadStatus: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  currentProcessingItem: string;
}

export const BatchUpload: React.FC = () => {
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState<BatchUploadData>({
    patientFile: null,
    labResultFile: null,
    patientData: [],
    labResultData: [],
    matchedData: [],
    validationErrors: [],
    uploadStatus: 'idle',
    progress: 0,
    currentProcessingItem: ''
  });

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Handle Patient List File (CSV/Excel)
  const handlePatientFileUpload = async (file: File) => {
    try {
      let patientData: PatientData[] = [];
      
      if (file.name.endsWith('.csv')) {
        // Parse CSV
        patientData = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: (result) => {
              // Debug: Log the raw parsed data
              console.log("Raw CSV data:", result.data);
              
              const data = result.data.map((row: any) => {
                // Debug: Log each row's reference number
                console.log("Row sample ref:", row['Sample Reference Number'] || row['sample_ref_no'] || row['SampleReferenceNumber']);
                
                return {
                  sampleReferenceNumber: row['Sample Reference Number'] || row['sample_ref_no'] || row['SampleReferenceNumber'] || '',
                  patientName: row['Patient Name'] || row['patient_name'] || row['PatientName'] || '',
                  dateOfBirth: row['Date of Birth'] || row['dob'] || row['DateOfBirth'] || '',
                  sex: row['Sex'] || row['gender'] || '',
                  mrn: row['MRN'] || row['mrn'] || '',
                  ethnicity: row['Ethnicity'] || row['ethnicity'] || '',
                  specimenType: row['Specimen Type'] || row['specimen_type'] || row['SpecimenType'] || '',
                  physicianName: row['Physician Name'] || row['physician'] || row['PhysicianName'] || '',
                  disease: row['Disease'] || row['disease'] || ''
                };
              });
              
              // Log processed data and filter out invalid rows
              console.log("Processed patient data:", data);
              resolve(data.filter((item: any) => item.sampleReferenceNumber && item.sampleReferenceNumber !== 'sample.sampleReferenceNumber'));
            },
            error: reject
          });
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("Raw Excel data:", jsonData);
        
        patientData = jsonData.map((row: any) => {
          // Map all possible column names
          const sampleRef = row['Sample Reference Number'] || row['sample_ref_no'] || row['SampleReferenceNumber'] || '';
          console.log("Excel row sample ref:", sampleRef);
          
          return {
            sampleReferenceNumber: sampleRef,
            patientName: row['Patient Name'] || row['patient_name'] || row['PatientName'] || '',
            dateOfBirth: row['Date of Birth'] || row['dob'] || row['DateOfBirth'] || '',
            sex: row['Sex'] || row['gender'] || '',
            mrn: row['MRN'] || row['mrn'] || '',
            ethnicity: row['Ethnicity'] || row['ethnicity'] || '',
            specimenType: row['Specimen Type'] || row['specimen_type'] || row['SpecimenType'] || '',
            physicianName: row['Physician Name'] || row['physician'] || row['PhysicianName'] || '',
            disease: row['Disease'] || row['disease'] || ''
          };
        }).filter((item: any) => item.sampleReferenceNumber && item.sampleReferenceNumber !== 'sample.sampleReferenceNumber');
      }

      console.log("Final patient data:", patientData);
      
      setBatchData(prev => ({
        ...prev,
        patientFile: file,
        patientData,
        validationErrors: []
      }));

      message.success(`Patient file uploaded successfully. Found ${patientData.length} patients.`);
    } catch (error) {
      console.error("Error parsing patient file:", error);
      message.error('Failed to parse patient file');
    }
  };

  // Handle Lab Test Results File (TXT)
  const handleLabResultFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const labResultData: LabTestResult[] = [];

      // Debug: Log the first few lines of the file
      console.log("TXT file first lines:", lines.slice(0, 5));

      // Assuming the first line is headers
      const headers = lines[0].trim().split('\t');
      console.log("TXT headers:", headers);
      
      // Map header indexes
      const headerIndexes: Record<string, number> = {};
      headers.forEach((header, index) => {
        const normalizedHeader = header.trim().toLowerCase().replace(/\s+/g, '');
        headerIndexes[normalizedHeader] = index;
        console.log(`Header "${header}" normalized to "${normalizedHeader}" at index ${index}`);
      });

      // Find the sample reference number column index with more flexible matching
      const possibleSampleRefHeaders = [
        'samplereferencenumber', 'samplerefno', 'sampleid', 'sample', 'samplenumber', 'referencenumber'
      ];
      
      let sampleRefIndex = -1;
      for (const possibleHeader of possibleSampleRefHeaders) {
        const foundIndex = Object.keys(headerIndexes).findIndex(h => h.includes(possibleHeader));
        if (foundIndex >= 0) {
          sampleRefIndex = headerIndexes[Object.keys(headerIndexes)[foundIndex]];
          console.log(`Found sample reference column at index ${sampleRefIndex} with header ${Object.keys(headerIndexes)[foundIndex]}`);
          break;
        }
      }
      
      if (sampleRefIndex === -1) {
        sampleRefIndex = 0; // Default to first column if not found
        console.log("No sample reference column found, defaulting to first column");
      }

      // Parse data rows
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const columns = line.split('\t');
          
          // Get the sample reference number with trimming to remove whitespace
          const sampleRef = columns[sampleRefIndex] ? columns[sampleRefIndex].trim() : '';
          
          // Skip header rows that might be repeated in the file
          if (sampleRef === 'Sample Reference Number' || !sampleRef) {
            continue;
          }
          
          console.log(`Line ${i}: Sample Ref = "${sampleRef}"`);
          
          // Get values using header indexes (with fallbacks)
          const drugIndex = headerIndexes['drugname'] || headerIndexes['drug'] || 1;
          const geneIndex = headerIndexes['genename'] || headerIndexes['gene'] || 2;
          const genoTypeIndex = headerIndexes['genotype'] || 3;
          const phenoTypeIndex = headerIndexes['phenotype'] || 4;
          const toxicityIndex = headerIndexes['drugresponsetoxicity'] || headerIndexes['toxicity'] || 5;
          const dosageIndex = headerIndexes['drugresponsedosage'] || headerIndexes['dosage'] || 6;
          const efficacyIndex = headerIndexes['drugresponseefficacy'] || headerIndexes['efficacy'] || 7;
          const evidenceIndex = headerIndexes['evidence'] || 8;
          const clinicalAnnotationIndex = headerIndexes['clinicalannotation'] || 9;
          
          labResultData.push({
            sampleReferenceNumber: sampleRef,
            drugName: columns[drugIndex] || '',
            geneName: columns[geneIndex] || '',
            genoType: columns[genoTypeIndex] || '',
            phenoType: columns[phenoTypeIndex] || '',
            drugResponseToxicity: columns[toxicityIndex] || '',
            drugResponseDosage: columns[dosageIndex] || '',
            drugResponseEfficacy: columns[efficacyIndex] || '',
            evidence: columns[evidenceIndex] || '',
            clinicalAnnotation: columns[clinicalAnnotationIndex] || ''
          });
        }
      }

      console.log("Processed lab result data:", labResultData);
      
      // Filter out invalid rows
      const validLabResults = labResultData.filter(item => 
        item.sampleReferenceNumber && 
        item.sampleReferenceNumber !== 'Sample Reference Number'
      );
      
      console.log("Valid lab results:", validLabResults);

      setBatchData(prev => ({
        ...prev,
        labResultFile: file,
        labResultData: validLabResults,
        validationErrors: []
      }));

      message.success(`Lab result file uploaded successfully. Found ${validLabResults.length} results.`);
    } catch (error) {
      console.error("Error parsing lab result file:", error);
      message.error('Failed to parse lab result file');
    }
  };

  // Validate and Match Data
  const validateAndMatchData = () => {
    const { patientData, labResultData } = batchData;
    const errors: string[] = [];
    const matchedData: any[] = [];

    // Check if both files are uploaded
    if (patientData.length === 0) {
      errors.push('Meta Data list file is required');
    }
    if (labResultData.length === 0) {
      errors.push('Lab test results file is required');
    }

    if (errors.length === 0) {
      console.log("Validating data match between:");
      console.log("Patient data:", patientData.map(p => p.sampleReferenceNumber));
      console.log("Lab results:", labResultData.map(l => l.sampleReferenceNumber));
      
      // First pass: Collect all unique sample reference numbers from both datasets
      const allSampleRefs = new Set([
        ...patientData.map(p => p.sampleReferenceNumber),
        ...labResultData.map(l => l.sampleReferenceNumber)
      ]);
      
      console.log("All unique sample refs:", [...allSampleRefs]);
      
      // For each patient, find matching lab results
     for (const patient of patientData) {
      // Pastikan string
      const patientRef = (patient.sampleReferenceNumber ?? '').toString().trim();

      const labResults = labResultData.filter(
        result => ((result.sampleReferenceNumber ?? '').toString().trim() === patientRef)
      );

      if (labResults.length === 0) {
        errors.push(`No lab results found for Sample Reference Number: ${patientRef}`);
      } else {
        matchedData.push({
          patient,
          labResults
        });
      }
    }

      // Check for lab results without matching patients
      for (const labResult of labResultData) {
        const labRef = (labResult.sampleReferenceNumber ?? '').toString().trim();
        const hasMatchingPatient = patientData.some(
          patient => ((patient.sampleReferenceNumber ?? '').toString().trim() === labRef)
        );
        if (!hasMatchingPatient) {
          errors.push(`No patient found for Sample Reference Number: ${labRef}`);
        }
      }
    }

    console.log("Validation complete. Errors:", errors);
    console.log("Matched data:", matchedData);

    setBatchData(prev => ({
      ...prev,
      matchedData,
      validationErrors: errors
    }));

    return errors.length === 0;
  };

  // Process a single record
  const processSingleRecord = async (patient: PatientData, labResults: LabTestResult[]) => {
    try {
      // Map lab results to the format expected by generateReportBlob
      const testResults = labResults.map(result => ({
        clinicalannotation: result.clinicalAnnotation || "",
        drug: result.drugName || "",
        gene: result.geneName ? result.geneName.split(",") : [],
        genotype: result.genoType ? result.genoType.split(",") : [],
        phenotype: result.phenoType ? result.phenoType.split(",") : [],
        toxicity: result.drugResponseToxicity ? result.drugResponseToxicity.split(",") : [],
        dosage: result.drugResponseDosage ? result.drugResponseDosage.split(",") : [],
        efficacy: result.drugResponseEfficacy ? result.drugResponseEfficacy.split(",") : [],
        evidence: result.evidence ? result.evidence.split(",") : [],
      }));

      // Remove duplicates
      const uniqueTestResults = testResults.filter((row, index, self) => {
        return (
          index === self.findIndex(
            (r) =>
              r.drug === row.drug &&
              JSON.stringify(r.gene) === JSON.stringify(row.gene) &&
              JSON.stringify(r.genotype) === JSON.stringify(row.genotype)
          )
        );
      });

      // Format data for report
      const reportData = {
        patient: {
          "Patient Name": patient.patientName,
          "Date of Birth": patient.dateOfBirth || dayjs().format("YYYY-MM-DD"),
          Sex: patient.sex,
          MRN: patient.mrn || `MRN-${patient.sampleReferenceNumber}`,
          Ethnicity: patient.ethnicity || "N/A",
        },
        specimen: {
          "Specimen Type": patient.specimenType || "Whole Blood",
          "Specimen ID": `SP-${patient.sampleReferenceNumber}`,
          "Specimen Collected": "TTSH Hospital",
          "Specimen Received": dayjs().format("YYYY-MM-DD"),
        },
        orderedBy: {
          Requester: "TTSH Hospital",
          Physician: patient.physicianName,
        },
        caseInfo: {
          "Test Case ID": patient.sampleReferenceNumber,
          "Review Status": "Final",
          "Date Accessioned": dayjs().format("YYYY-MM-DD"),
          "Date Reported": dayjs().format("YYYY-MM-DD"),
        },
        test_information: "Pharmacogenomics Test", // Default or can be customized
        lab_result_summary: "Batch uploaded lab test results", // Default or can be customized
        testResults: uniqueTestResults,
      };

      // Generate PDF blob
      const pdfBlob = await generateReportBlob(reportData);

      // Generate HL7 message
      const hl7Message = buildHL7Message({
        patient_name: patient.patientName,
        date_of_birth: patient.dateOfBirth || dayjs().format("YYYY-MM-DD"),
        sex: patient.sex,
        mrn: patient.mrn || `MRN-${patient.sampleReferenceNumber}`,
        test_case_id: patient.sampleReferenceNumber,
        specimen_type: patient.specimenType || "Whole Blood",
        specimen_id: `SP-${patient.sampleReferenceNumber}`,
        specimen_collected_from: "TTSH Hospital",
        specimen_received: dayjs().format("YYYY-MM-DD"),
        test_information: "Pharmacogenomics Test",
        lab_result_summary: "Batch uploaded lab test results",
        testResults: uniqueTestResults,
      });

      // Create HL7 blob
      const hl7Blob = new Blob([hl7Message], { type: "text/plain" });

      // Create FormData object
      const formData = new FormData();
      
      // Add files
      const patientName = patient.patientName.replace(/\s+/g, "_");
      formData.append("report_download_pdf", pdfBlob, `${patientName}_Report.pdf`);
      formData.append("report_download_hl7", hl7Blob, `${patientName}_Report.hl7`);
      
      // Add patient data
      formData.append("patient_name", patient.patientName);
      formData.append("date_of_birth", patient.dateOfBirth || dayjs().format("YYYY-MM-DD"));
      formData.append("sex", patient.sex);
      formData.append("mrn", patient.mrn || `MRN-${patient.sampleReferenceNumber}`);
      formData.append("ethnicity", patient.ethnicity || "N/A");
      formData.append("specimen_type", patient.specimenType || "Whole Blood");
      formData.append("physician_name", patient.physicianName);
      formData.append("disease", patient.disease);
      formData.append("test_case_id", patient.sampleReferenceNumber);
      
      // Add other required fields
      formData.append("specimen_collected_from", "TTSH Hospital");
      formData.append("specimen_id", `SP-${patient.sampleReferenceNumber}`);
      formData.append("specimen_received", dayjs().format("YYYY-MM-DD"));
      formData.append("test_information", "Pharmacogenomics Test");
      formData.append("lab_result_summary", "Batch uploaded lab test results");
      formData.append("reviewer_name", "System Generated");

      // Send to API
      const response = await fetch(`${API_URL}/lab-tests`, {
        method: "POST",
        body: formData,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to upload record for ${patient.patientName}`);
      }

      return true;
    } catch (error) {
      console.error(`Error processing record for ${patient.patientName}:`, error);
      throw error;
    }
  };

  // Process Batch Upload
  const processBatchUpload = async () => {
    if (!validateAndMatchData()) {
      message.error('Please fix validation errors before uploading');
      return;
    }

    setConfirmModalVisible(false);
    setBatchData(prev => ({ 
      ...prev, 
      uploadStatus: 'processing', 
      progress: 0,
      currentProcessingItem: ''
    }));

    try {
      const { matchedData } = batchData;
      const totalItems = matchedData.length;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < matchedData.length; i++) {
        const { patient, labResults } = matchedData[i];
        
        // Update progress and current item
        const progress = Math.round(((i) / totalItems) * 100);
        setBatchData(prev => ({ 
          ...prev, 
          progress, 
          currentProcessingItem: patient.patientName 
        }));

        try {
          // Process this record
          await processSingleRecord(patient, labResults);
          successCount++;
          
          // Update progress
          const newProgress = Math.round(((i + 1) / totalItems) * 100);
          setBatchData(prev => ({ 
            ...prev, 
            progress: newProgress
          }));
        } catch (error) {
          failCount++;
          console.error(`Failed to process ${patient.patientName}:`, error);
        }

        // Small delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Final update
      setBatchData(prev => ({ 
        ...prev, 
        uploadStatus: 'success', 
        progress: 100,
        currentProcessingItem: ''
      }));

      // Show success message
      message.success(`Successfully uploaded ${successCount} lab test records! ${failCount > 0 ? `(${failCount} failed)` : ''}`);
      
      // Show success modal
      setSuccessModalVisible(true);

    } catch (error: any) {
      setBatchData(prev => ({ 
        ...prev, 
        uploadStatus: 'error', 
        progress: 0,
        currentProcessingItem: ''
      }));
      message.error(`Batch upload failed: ${error.message}`);
      console.error("Batch upload error:", error);
    }
  };

  const columns = [
    {
      title: 'Sample Reference Number',
      dataIndex: ['patient', 'sampleReferenceNumber'],
      key: 'sampleReferenceNumber',
    },
    {
      title: 'Patient Name',
      dataIndex: ['patient', 'patientName'],
      key: 'patientName',
    },
    {
      title: 'Patient Info',
      key: 'patientInfo',
      render: (_, record: any) => (
        <div>
          <div>Sex: {record.patient.sex || 'N/A'}</div>
          <div>DOB: {record.patient.dateOfBirth || 'N/A'}</div>
          <div>Disease: {record.patient.disease || 'N/A'}</div>
        </div>
      ),
    },
    {
      title: 'Lab Results',
      key: 'labResults',
      render: (_, record: any) => (
        <div>
          <div>Count: {record.labResults.length}</div>
          <div>
            {record.labResults.slice(0, 2).map((result: any, index: number) => (
              <div key={index} style={{ fontSize: '12px', color: '#666' }}>
                {result.drugName || 'N/A'} / {result.geneName || 'N/A'}
              </div>
            ))}
            {record.labResults.length > 2 && (
              <div style={{ fontSize: '12px', color: '#666' }}>...</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      render: () => <span style={{ color: 'green' }}>✓ Matched</span>,
      key: 'status',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Batch Upload Lab Tests" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Upload Requirements"
            description="Please upload exactly 2 files: 1 Patient List file (.csv/.xlsx) and 1 Lab Test Results file (.txt)"
            type="info"
            showIcon
          />

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            {/* Patient List File Upload */}
            <Card size="small" style={{ flex: 1 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileExcelOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                  <strong>Meta Data List File</strong>
                </div>
                <Upload
                  accept=".csv,.xlsx,.xls"
                  beforeUpload={(file) => {
                    handlePatientFileUpload(file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    {batchData.patientFile ? 'Change File' : 'Select Patient File'}
                  </Button>
                </Upload>
                {batchData.patientFile && (
                  <div style={{ color: '#52c41a' }}>
                    ✓ {batchData.patientFile.name} ({batchData.patientData.length} patients)
                  </div>
                )}
              </Space>
            </Card>

            {/* Lab Results File Upload */}
            <Card size="small" style={{ flex: 1 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                  <strong>Lab Test Results File</strong>
                </div>
                <Upload
                  accept=".txt"
                  beforeUpload={(file) => {
                    handleLabResultFileUpload(file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    {batchData.labResultFile ? 'Change File' : 'Select Results File'}
                  </Button>
                </Upload>
                {batchData.labResultFile && (
                  <div style={{ color: '#1890ff' }}>
                    ✓ {batchData.labResultFile.name} ({batchData.labResultData.length} results)
                  </div>
                )}
              </Space>
            </Card>
          </div>
          
          {/* SUBMIT BUTTON */}
          <Button
            type="primary"
            size="large"
            icon={<CloudUploadOutlined />}
            onClick={() => {
              if (validateAndMatchData()) {
                setConfirmModalVisible(true);
              }
            }}
            loading={batchData.uploadStatus === 'processing'}
            disabled={!batchData.patientFile || !batchData.labResultFile}
            style={{ 
              width: '100%', 
              height: '50px', 
              fontSize: '16px',
              marginTop: '10px',
              backgroundColor: '#1890ff', 
              borderColor: '#1890ff' 
            }}
          >
            PROCESS BATCH UPLOAD
          </Button>
        </Space>
      </Card>

      {/* Validation Errors */}
      {batchData.validationErrors.length > 0 && (
        <Card title="Validation Errors" style={{ marginBottom: '24px' }}>
          <Alert
            message="Please fix the following errors:"
            description={
              <ul>
                {batchData.validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            }
            type="error"
            showIcon
          />
        </Card>
      )}

      {/* Matched Data Preview */}
      {batchData.matchedData.length > 0 && (
        <Card 
          title={`Matched Data Preview (${batchData.matchedData.length} records)`}
          extra={
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={processBatchUpload}
              loading={batchData.uploadStatus === 'processing'}
              disabled={batchData.validationErrors.length > 0}
            >
              Start Batch Upload
            </Button>
          }
        >
          {batchData.uploadStatus === 'processing' && (
            <div style={{ marginBottom: '16px' }}>
              <Progress percent={batchData.progress} status="active" />
              <p>
                Uploading records... {batchData.progress}%
                {batchData.currentProcessingItem && (
                  <span> (Processing: {batchData.currentProcessingItem})</span>
                )}
              </p>
            </div>
          )}
          
          {batchData.uploadStatus === 'success' && (
            <Alert 
              message="Upload Complete" 
              description="All records have been successfully processed. Redirecting to lab tests page..."
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
          
          <Table
            columns={columns}
            dataSource={batchData.matchedData}
            rowKey={(record) => record.patient.sampleReferenceNumber}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>
      )}

      {/* Confirmation Modal */}
      

      {/* Success Modal */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center' }}><CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} /> Upload Successful</div>}
        open={successModalVisible}
        footer={[
          <Button 
            key="ok" 
            type="primary"
            onClick={() => {
              setSuccessModalVisible(false);
              navigate('/lab-tests');
            }}
          >
            Go to Lab Tests
          </Button>
        ]}
        closable={false}
      >
        <Alert
          message="Batch upload completed successfully"
          description={
            <div>
              <p>All <strong>{batchData.matchedData.length} lab test records</strong> have been successfully uploaded.</p>
              <p>You will be redirected to the Lab Tests page when you click the button below.</p>
            </div>
          }
          type="success"
          showIcon
        />
        <Progress percent={100} status="success" />
      </Modal>
    </div>
  );
};

export default BatchUpload;