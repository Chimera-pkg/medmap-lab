import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Upload, Button, Row, Col } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { UploadOutlined } from "@ant-design/icons";

export const PostCreate: React.FC = () => {
    const { formProps, saveButtonProps } = useForm();

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} layout="vertical">
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
                            <Input placeholder="Example: John Doe" />
                        </Form.Item>
                        <Form.Item
                            label="Date of Birth"
                            name="date_of_birth"
                            rules={[{ required: true, message: "Date of Birth is required" }]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="DD/MM/YYYY"
                                placeholder="Pilih tanggal"
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
                            rules={[{ required: true, message: "Physician is required" }]}
                        >
                            <Input placeholder="Example: Dr Ong" />
                        </Form.Item>
                        <Form.Item
                            label="Disease"
                            name="disease"
                            rules={[{ required: true, message: "Disease is required" }]}
                        >
                            <Input placeholder="E.G Hispanic" />
                        </Form.Item>
                        <Form.Item
                            label="Ethnicity"
                            name="ethnicity"
                            rules={[{ required: true, message: "Ethnicity is required" }]}
                        >
                            <Input placeholder="E.G Hispanic" />
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
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                format="DD/MM/YYYY"
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

export default PostCreate;