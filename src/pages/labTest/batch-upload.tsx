import React, { useState } from "react";
import { Upload, Button, message, Table, Space, Progress, Card, Form, Input, DatePicker, Select } from "antd";
import { UploadOutlined, DeleteOutlined, CloudUploadOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import dayjs from "dayjs";
import { API_URL } from "../../config";
import { generateReportBlob } from "../../utils/generateReport";
import { buildHL7Message } from "../../utils/generateHl7";
import { useNavigate } from "react-router-dom";

interface BatchUploadItem {
  id: string;
  fileName: string;
  csvData: any[];
  status: 'pending' | 'processing' | 'success' | 'error';
  progress: number;
  error?: string;
  formData: {
    patient_name: string;
    test_case_id: string;
    physician_name: string;
    disease: string;
    // Add other required fields
  };
}

export const BatchUpload: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [uploadItems, setUploadItems] = useState<BatchUploadItem[]>([]);
  const [uploading, setUploading] = useState(false);

  // Handle CSV file upload
  const handleUpload = async (file: File) => {
    return new Promise<any[]>((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(new Error("CSV parsing failed"));
            return;
          }
          resolve(result.data);
        },
        error: (error) => reject(error),
      });
    });
  };

  // Add files to batch upload list
  const handleFileChange = async (info: any) => {
    const { fileList } = info;
    const newItems: BatchUploadItem[] = [];

    for (const file of fileList) {
      if (file.originFileObj && file.status !== 'removed') {
        try {
          const csvData = await handleUpload(file.originFileObj);
          
          newItems.push({
            id: file.uid,
            fileName: file.name,
            csvData,
            status: 'pending',
            progress: 0,
            formData: {
              patient_name: '',
              test_case_id: '',
              physician_name: '',
              disease: '',
            }
          });
        } catch (error) {
          message.error(`Failed to parse ${file.name}`);
        }
      }
    }

    setUploadItems(prev => [...prev.filter(item => 
      fileList.some((f: any) => f.uid === item.id)
    ), ...newItems]);
  };

  // Update form data for specific item
  const updateItemFormData = (itemId: string, field: string, value: any) => {
    setUploadItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, formData: { ...item.formData, [field]: value } }
        : item
    ));
  };

  // Remove item from list
  const removeItem = (itemId: string) => {
    setUploadItems(prev => prev.filter(item => item.id !== itemId));
  };

  // Process single item
  const processItem = async (item: BatchUploadItem): Promise<void> => {
    try {
      // Update status to processing
      setUploadItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'processing', progress: 10 } : i
      ));

      // Validate required fields
      const { patient_name, test_case_id, physician_name, disease } = item.formData;
      if (!patient_name || !test_case_id || !physician_name || !disease) {
        throw new Error("Missing required fields");
      }

      // Process CSV data similar to create.tsx
      const testResults = item.csvData.map((row) => ({
        clinicalannotation: row.Clinical_Annotation || "",
        drug: row.Drug_Name || "",
        gene: row.Gene_Name ? row.Gene_Name.split(",") : [],
        genotype: row.GenoType ? row.GenoType.split(",") : [],
        phenotype: row.PhenoType ? row.PhenoType.split(",") : [],
        toxicity: row.Drug_Response_Toxicity ? row.Drug_Response_Toxicity.split(",") : [],
        dosage: row.Drug_Response_Dosage ? row.Drug_Response_Dosage.split(",") : [],
        efficacy: row.Drug_Response_Efficacy ? row.Drug_Response_Efficacy.split(",") : [],
        evidence: row.Evidence ? row.Evidence.split(",") : [],
      }));

      // Remove duplicates
      const uniqueTestResults = testResults.filter((row, index, self) => {
        return index === self.findIndex(r => 
          r.drug === row.drug &&
          JSON.stringify(r.gene) === JSON.stringify(row.gene) &&
          JSON.stringify(r.genotype) === JSON.stringify(row.genotype)
        );
      });

      setUploadItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, progress: 30 } : i
      ));

      // Generate report data
      const reportData = {
        patient: {
          "Patient Name": patient_name,
          "Date of Birth": dayjs().format("YYYY-MM-DD"), // Default or from form
          Sex: "Unknown", // Default or from form
          MRN: `MRN-${test_case_id}`, // Generate or from form
          Ethnicity: "N/A",
        },
        specimen: {
          "Specimen Type": "Whole Blood", // Default or from form
          "Specimen ID": `SP-${test_case_id}`,
          "Specimen Collected": "TTSH Hospital",
          "Specimen Received": dayjs().format("YYYY-MM-DD"),
        },
        orderedBy: {
          Requester: "TTSH Hospital",
          Physician: physician_name,
        },
        caseInfo: {
          "Test Case ID": test_case_id,
          "Review Status": "Final",
          "Date Accessioned": dayjs().format("YYYY-MM-DD"),
          "Date Reported": dayjs().format("YYYY-MM-DD"),
        },
        test_information: "Pharmacogenomics Test", // Default
        lab_result_summary: "Test completed successfully", // Default
        testResults: uniqueTestResults,
      };

      setUploadItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, progress: 50 } : i
      ));

      // Generate PDF and HL7
      const pdfBlob = await generateReportBlob(reportData);
      const hl7Message = buildHL7Message({
        patient_name,
        date_of_birth: dayjs().format("YYYY-MM-DD"),
        sex: "Unknown",
        mrn: `MRN-${test_case_id}`,
        test_case_id,
        specimen_type: "Whole Blood",
        specimen_id: `SP-${test_case_id}`,
        specimen_collected_from: "TTSH Hospital",
        specimen_received: dayjs().format("YYYY-MM-DD"),
        test_information: "Pharmacogenomics Test",
        lab_result_summary: "Test completed successfully",
        testResults: uniqueTestResults,
      });

      const hl7Blob = new Blob([hl7Message], { type: "text/plain" });

      setUploadItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, progress: 70 } : i
      ));

      // Create FormData
      const formData = new FormData();
      const patientName = patient_name.replace(/\s+/g, "_");
      formData.append("report_download_pdf", pdfBlob, `${patientName}_Report.pdf`);
      formData.append("report_download_hl7", hl7Blob, `${patientName}_Report.hl7`);
      
      // Add all required fields
      formData.append("patient_name", patient_name);
      formData.append("test_case_id", test_case_id);
      formData.append("physician_name", physician_name);
      formData.append("disease", disease);
      formData.append("date_of_birth", dayjs().format("YYYY-MM-DD"));
      formData.append("sex", "Unknown");
      formData.append("mrn", `MRN-${test_case_id}`);
      formData.append("ethnicity", "N/A");
      formData.append("specimen_collected_from", "TTSH Hospital");
      formData.append("specimen_type", "Whole Blood");
      formData.append("specimen_id", `SP-${test_case_id}`);
      formData.append("specimen_received", dayjs().format("YYYY-MM-DD"));
      formData.append("test_information", "Pharmacogenomics Test");
      formData.append("lab_result_summary", "Test completed successfully");
      formData.append("reviewer_name", "System Generated");

      setUploadItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, progress: 90 } : i
      ));

      // Send to backend
      const response = await fetch(`${API_URL}/lab-tests`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload to server");
      }

      // Success
      setUploadItems(prev => prev.map(i => 
        i.id === item.id ? { ...i, status: 'success', progress: 100 } : i
      ));

    } catch (error: any) {
      setUploadItems(prev => prev.map(i => 
        i.id === item.id ? { 
          ...i, 
          status: 'error', 
          error: error.message,
          progress: 0 
        } : i
      ));
    }
  };

  // Process all items
  const handleBatchUpload = async () => {
    setUploading(true);
    
    // Validate all items have required data
    const invalidItems = uploadItems.filter(item => 
      !item.formData.patient_name || 
      !item.formData.test_case_id || 
      !item.formData.physician_name || 
      !item.formData.disease
    );

    if (invalidItems.length > 0) {
      message.error("Please fill in all required fields for all items");
      setUploading(false);
      return;
    }

    try {
      // Process items sequentially to avoid overwhelming the server
      for (const item of uploadItems) {
        if (item.status === 'pending') {
          await processItem(item);
          // Add small delay between uploads
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      message.success("Batch upload completed!");
      
      // Optional: redirect after success
      setTimeout(() => {
        navigate("/lab-tests");
      }, 2000);

    } catch (error) {
      message.error("Batch upload failed");
    } finally {
      setUploading(false);
    }
  };

  const columns = [
    {
      title: 'File Name',
      dataIndex: 'fileName',
      key: 'fileName',
    },
    {
      title: 'Patient Name',
      key: 'patient_name',
      render: (_, record: BatchUploadItem) => (
        <Input
          placeholder="Enter patient name"
          value={record.formData.patient_name}
          onChange={(e) => updateItemFormData(record.id, 'patient_name', e.target.value)}
          disabled={record.status === 'processing' || record.status === 'success'}
        />
      ),
    },
    {
      title: 'Test Case ID',
      key: 'test_case_id',
      render: (_, record: BatchUploadItem) => (
        <Input
          placeholder="Enter test case ID"
          value={record.formData.test_case_id}
          onChange={(e) => updateItemFormData(record.id, 'test_case_id', e.target.value)}
          disabled={record.status === 'processing' || record.status === 'success'}
        />
      ),
    },
    {
      title: 'Physician',
      key: 'physician_name',
      render: (_, record: BatchUploadItem) => (
        <Input
          placeholder="Enter physician name"
          value={record.formData.physician_name}
          onChange={(e) => updateItemFormData(record.id, 'physician_name', e.target.value)}
          disabled={record.status === 'processing' || record.status === 'success'}
        />
      ),
    },
    {
      title: 'Disease',
      key: 'disease',
      render: (_, record: BatchUploadItem) => (
        <Input
          placeholder="Enter disease"
          value={record.formData.disease}
          onChange={(e) => updateItemFormData(record.id, 'disease', e.target.value)}
          disabled={record.status === 'processing' || record.status === 'success'}
        />
      ),
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record: BatchUploadItem) => (
        <Space direction="vertical" style={{ width: '100%' }}>
          <span style={{ 
            color: record.status === 'success' ? 'green' : 
                   record.status === 'error' ? 'red' : 
                   record.status === 'processing' ? 'blue' : 'gray'
          }}>
            {record.status.toUpperCase()}
          </span>
          {record.status === 'processing' && (
            <Progress percent={record.progress} size="small" />
          )}
          {record.error && (
            <span style={{ color: 'red', fontSize: '12px' }}>{record.error}</span>
          )}
        </Space>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: BatchUploadItem) => (
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.id)}
          disabled={record.status === 'processing'}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Batch Upload Lab Tests" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Upload
            multiple
            accept=".csv"
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent auto upload
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>
              Select CSV Files
            </Button>
          </Upload>
          
          <p style={{ color: '#666', fontSize: '14px' }}>
            Select multiple CSV files containing lab test data. Each file will become a separate lab test record.
          </p>
        </Space>
      </Card>

      {uploadItems.length > 0 && (
        <Card 
          title={`Upload Queue (${uploadItems.length} items)`}
          extra={
            <Space>
              <Button
                type="primary"
                icon={<CloudUploadOutlined />}
                onClick={handleBatchUpload}
                loading={uploading}
                disabled={uploadItems.length === 0}
              >
                Start Batch Upload
              </Button>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={uploadItems}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
          />
        </Card>
      )}
    </div>
  );
};

export default BatchUpload;