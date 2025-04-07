import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Upload, Button, Row, Col } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { generateReportBlob } from "../../utils/generateReport";
import { API_URL } from "../../config";

export const PostCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm({
        onFinish: async (values) => {
            const { date_of_birth, specimen_received, ...restValues } = values;
        
            // Format data for the report
            const reportData = {
                patient: {
                    "Patient Name": values.patient_name,
                    "Date of Birth": date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : null,
                    Sex: values.sex,
                    MRN: values.mrn,
                    Ethnicity: values.ethnicity || "N/A",
                },
                specimen: {
                    "Specimen Type": values.specimen_type,
                    "Specimen ID": values.specimen_id,
                    "Collected": values.specimen_collected_from || "N/A",
                    "Received": specimen_received ? dayjs(specimen_received).format("YYYY-MM-DD") : null,
                },
                orderedBy: {
                    Requester: "TTSH",
                    Physician: values.physician_name,
                },
                caseInfo: {
                    "Test Case ID": values.test_case_id,
                    "Review Status": "Final",
                    "Date Accessioned": dayjs().format("YYYY-MM-DD"),
                    "Date Reported": dayjs().format("YYYY-MM-DD"),
                },
                testResults: [
                    {
                        drug: "Warfarin",
                        gene: "CYP2C9",
                        genotype: "*1/*1",
                        phenotype: "Normal Metabolizer",
                        toxicity: "–",
                        dosage: "–",
                        efficacy: "–",
                    },
                ],
                footerText: "The lab-developed pharmacogenomic assay tests for ABCG2, CYP2C19, CYP2C9, CYP2D6, CYP3A5, CYP4F2, DPYD, HLA-A, HLA-B, NUDT15, SLCO1B1, TPMT, UGT1A1, and VKORC1 gene variants by Taqman SNP Genotyping Assays on Quantstudio 6 Flex Real-time PCR system from Thermo Fisher Scientific.",
            };
        
            // Generate PDF blob (without downloading)
            const pdfBlob = await generateReportBlob(reportData);
        
            // Generate HL7 data
            const hl7Data = {
                ...restValues,
                date_of_birth: date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : null,
                specimen_received: specimen_received ? dayjs(specimen_received).format("YYYY-MM-DD") : null,
            };
            
            // Create HL7 blob
            const hl7Blob = new Blob([JSON.stringify(hl7Data)], { type: "application/json" });
        
            try {
                // Create FormData to send files
                const formData = new FormData();
                formData.append("pdf", pdfBlob, "report.pdf");
                formData.append("hl7", hl7Blob, "report.hl7");
                
                // Format all form values for server submission
                const formattedValues = {
                    ...values,
                    date_of_birth: date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : null,
                    specimen_received: specimen_received ? dayjs(specimen_received).format("YYYY-MM-DD") : null,
                };
                formData.append("data", new Blob([JSON.stringify(formattedValues)], { type: "application/json" }), "data.json");
        
                // Send data to the server
                const response = await fetch(`${API_URL}/lab-tests`, {
                    method: "POST",
                    body: formData,
                });
        
                if (!response.ok) {
                    throw new Error("Failed to upload files");
                }
        
                console.log("Record created successfully");
                return formattedValues;
            } catch (error) {
                console.error("Error creating record:", error);
                throw error;
            }
        },
    });

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
                {/* Form fields remain the same */}
                <Row gutter={16}>
                    {/* Row 1: 5 fields */}
                    <Col span={8}>
                        <Form.Item
                            label="Patient Name"
                            name="patient_name"
                            rules={[{ required: true, message: "Patient Name is required" }]}
                        >
                            <Input placeholder="Example: John Doe" />
                        </Form.Item>
                        <Form.Item
                            label="Test Case ID"
                            name="test_case_id"
                            rules={[{ required: true, message: "Test Case ID is required" }]}
                        >
                            <Input placeholder="Example: TC-001" />
                        </Form.Item>
                        <Form.Item
                            label="Date of Birth"
                            name="date_of_birth"
                            rules={[{ required: true, message: "Date of Birth is required" }]}
                            getValueProps={(value) => ({
                                value: value ? dayjs(value) : undefined,
                            })}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                                placeholder="Choose date"
                            />
                        </Form.Item>
                        <Form.Item
                            label="Sex"
                            name="sex"
                            rules={[{ required: true, message: "Sex is required" }]}
                        >
                            <Select
                                placeholder="Choose gender"
                                options={[
                                    { label: "Male", value: "Male" },
                                    { label: "Female", value: "Female" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Physician Name"
                            name="physician_name"
                            rules={[{ required: true, message: "Physician Name is required" }]}
                        >
                            <Input placeholder="Example: Dr Ong" />
                        </Form.Item>
                        <Form.Item
                                      label="Disease"
                                      name="disease"
                                      rules={[{ required: true, message: "Disease is required" }]}
                                    >
                                      <Input placeholder="Example: Diabetes" />
                                    </Form.Item>
                                    <Form.Item
                                      label="Ethnicity"
                                      name="ethnicity"
                                      rules={[{ required: true, message: "Ethnicity is required" }]}
                                    >
                                      <Input placeholder="Example: Hispanic" />
                                    </Form.Item>
                    </Col>

                    {/* Row 2: 5 fields */}
                    <Col span={8}>
                        <Form.Item
                            label="MRN"
                            name="mrn"
                            rules={[{ required: true, message: "MRN is required" }]}
                        >
                            <Input placeholder="MRN" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen Collected From"
                            name="specimen_collected_from"
                            rules={[{ required: true, message: "Specimen Collected From is required" }]}
                        >
                            <Input placeholder="Example: Name of hospital" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen Type"
                            name="specimen_type"
                            rules={[{ required: true, message: "Specimen Type is required" }]}
                        >
                            <Input placeholder="Example: Whole blood" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen ID"
                            name="specimen_id"
                            rules={[{ required: true, message: "Specimen ID is required" }]}
                        >
                            <Input placeholder="E.G 001 002" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen Date"
                            name="specimen_received"
                            rules={[{ required: true, message: "Specimen Date is required" }]}
                            getValueProps={(value) => ({
                                value: value ? dayjs(value) : undefined,
                            })}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="YYYY-MM-DD"
                                placeholder="Choose date"
                            />
                        </Form.Item>
                        <Form.Item
                                      label="Reviewed By"
                                      name="reviewer_name"
                                    >
                                      <Input placeholder="Example: Dr. Ong Kiat Hoe" />
                                    </Form.Item>
                    </Col>

                    {/* Row 3: 3 fields */}
                    <Col span={8}>
                        <Form.Item
                            label="Test Information"
                            name="test_information"
                            rules={[{ required: true, message: "Test Information is required" }]}
                        >
                            <MDEditor />
                        </Form.Item>
                        <Form.Item
                            label="Lab Result Summary"
                            name="lab_result_summary"
                            rules={[{ required: true, message: "Lab Result Summary is required" }]}
                        >
                            <MDEditor />
                        </Form.Item>
                        <Form.Item
                            label="Upload CSV File"
                            name="upload_csv_file"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                        >
                            <Upload
                                name="file"
                                action="/upload.do"
                                listType="text"
                            >
                                <Button icon={<UploadOutlined />}>Upload CSV</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};