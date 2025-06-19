import React, { useState } from "react";
import { Upload, Button, message, Card, Space, Table, Progress, Alert } from "antd";
import { UploadOutlined, CloudUploadOutlined, FileExcelOutlined, FileTextOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";

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
  // Add other fields from CSV template
}

interface LabTestResult {
  sampleReferenceNumber: string;
  genotype: string;
  phenotype: string;
  activityScore: string;
  drugName: string;
  // Add other fields from TXT file
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
    progress: 0
  });

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
              const data = result.data.map((row: any) => ({
                sampleReferenceNumber: row['Sample Reference Number'] || row['sample_ref_no'],
                patientName: row['Patient Name'] || row['patient_name'],
                dateOfBirth: row['Date of Birth'] || row['dob'],
                sex: row['Sex'] || row['gender'],
                mrn: row['MRN'] || row['mrn'],
                ethnicity: row['Ethnicity'] || row['ethnicity'],
                specimenType: row['Specimen Type'] || row['specimen_type'],
                physicianName: row['Physician Name'] || row['physician'],
                disease: row['Disease'] || row['disease']
              }));
              resolve(data);
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
        
        patientData = jsonData.map((row: any) => ({
          sampleReferenceNumber: row['Sample Reference Number'] || row['sample_ref_no'],
          patientName: row['Patient Name'] || row['patient_name'],
          dateOfBirth: row['Date of Birth'] || row['dob'],
          sex: row['Sex'] || row['gender'],
          mrn: row['MRN'] || row['mrn'],
          ethnicity: row['Ethnicity'] || row['ethnicity'],
          specimenType: row['Specimen Type'] || row['specimen_type'],
          physicianName: row['Physician Name'] || row['physician'],
          disease: row['Disease'] || row['disease']
        }));
      }

      setBatchData(prev => ({
        ...prev,
        patientFile: file,
        patientData,
        validationErrors: []
      }));

      message.success(`Patient file uploaded successfully. Found ${patientData.length} patients.`);
    } catch (error) {
      message.error('Failed to parse patient file');
      console.error(error);
    }
  };

  // Handle Lab Test Results File (TXT)
  const handleLabResultFileUpload = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.split('\n');
      const labResultData: LabTestResult[] = [];

      // Parse TXT file format (adjust based on actual format)
      for (let i = 1; i < lines.length; i++) { // Skip header
        const line = lines[i].trim();
        if (line) {
          const columns = line.split('\t'); // Assuming tab-separated
          labResultData.push({
            sampleReferenceNumber: columns[0],
            genotype: columns[1] || '',
            phenotype: columns[2] || '',
            activityScore: columns[3] || '',
            drugName: columns[4] || ''
            // Add more fields based on actual TXT format
          });
        }
      }

      setBatchData(prev => ({
        ...prev,
        labResultFile: file,
        labResultData,
        validationErrors: []
      }));

      message.success(`Lab result file uploaded successfully. Found ${labResultData.length} results.`);
    } catch (error) {
      message.error('Failed to parse lab result file');
      console.error(error);
    }
  };

  // Validate and Match Data
  const validateAndMatchData = () => {
    const { patientData, labResultData } = batchData;
    const errors: string[] = [];
    const matchedData: any[] = [];

    // Check if both files are uploaded
    if (patientData.length === 0) {
      errors.push('Patient list file is required');
    }
    if (labResultData.length === 0) {
      errors.push('Lab test results file is required');
    }

    if (errors.length === 0) {
      // Match data based on Sample Reference Number
      for (const patient of patientData) {
        const labResults = labResultData.filter(
          result => result.sampleReferenceNumber === patient.sampleReferenceNumber
        );

        if (labResults.length === 0) {
          errors.push(`No lab results found for Sample Reference Number: ${patient.sampleReferenceNumber}`);
        } else {
          matchedData.push({
            patient,
            labResults
          });
        }
      }

      // Check for lab results without matching patients
      for (const labResult of labResultData) {
        const hasMatchingPatient = patientData.some(
          patient => patient.sampleReferenceNumber === labResult.sampleReferenceNumber
        );
        if (!hasMatchingPatient) {
          errors.push(`No patient found for Sample Reference Number: ${labResult.sampleReferenceNumber}`);
        }
      }
    }

    setBatchData(prev => ({
      ...prev,
      matchedData,
      validationErrors: errors
    }));

    return errors.length === 0;
  };

  // Process Batch Upload
  const processBatchUpload = async () => {
    if (!validateAndMatchData()) {
      message.error('Please fix validation errors before uploading');
      return;
    }

    setBatchData(prev => ({ ...prev, uploadStatus: 'processing', progress: 0 }));

    try {
      const { matchedData } = batchData;
      const totalItems = matchedData.length;

      for (let i = 0; i < matchedData.length; i++) {
        const { patient, labResults } = matchedData[i];
        
        // Update progress
        const progress = Math.round(((i + 1) / totalItems) * 100);
        setBatchData(prev => ({ ...prev, progress }));

        // Create lab test record for each matched patient
        const formData = new FormData();
        
        // Add patient data
        formData.append('patient_name', patient.patientName);
        formData.append('date_of_birth', patient.dateOfBirth);
        formData.append('sex', patient.sex);
        formData.append('mrn', patient.mrn);
        formData.append('ethnicity', patient.ethnicity);
        formData.append('specimen_type', patient.specimenType);
        formData.append('physician_name', patient.physicianName);
        formData.append('disease', patient.disease);
        formData.append('test_case_id', patient.sampleReferenceNumber);
        
        // Add lab results data as JSON
        formData.append('lab_results', JSON.stringify(labResults));
        
        // Add default values
        formData.append('specimen_collected_from', 'TTSH Hospital');
        formData.append('specimen_id', `SP-${patient.sampleReferenceNumber}`);
        formData.append('specimen_received', new Date().toISOString().split('T')[0]);
        formData.append('test_information', 'Pharmacogenomics Test');
        formData.append('lab_result_summary', 'Batch uploaded lab test results');
        formData.append('reviewer_name', 'System Generated');

        // Send to backend
        const response = await fetch(`${API_URL}/lab-tests/batch`, {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to upload record for ${patient.patientName}`);
        }

        // Small delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      setBatchData(prev => ({ ...prev, uploadStatus: 'success', progress: 100 }));
      message.success(`Successfully uploaded ${matchedData.length} lab test records!`);
      
      // Redirect to lab tests page after 2 seconds
      setTimeout(() => {
        navigate('/lab-tests');
      }, 2000);

    } catch (error: any) {
      setBatchData(prev => ({ ...prev, uploadStatus: 'error', progress: 0 }));
      message.error(`Batch upload failed: ${error.message}`);
      console.error(error);
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
      title: 'Lab Results Count',
      render: (_, record: any) => record.labResults.length,
      key: 'labResultsCount',
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

          <div style={{ display: 'flex', gap: '16px' }}>
            {/* Patient List File Upload */}
            <Card size="small" style={{ flex: 1 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileExcelOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                  <strong>Patient List File</strong>
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
              <Progress percent={batchData.progress} />
              <p>Uploading records... {batchData.progress}%</p>
            </div>
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
    </div>
  );
};

export default BatchUpload;