import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Upload, Button, Row, Col, notification } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import Papa from "papaparse";

export const PostCreate: React.FC = () => {
  // Misalnya untuk redirect setelah sukses
  const navigate = useNavigate();

  const { formProps, saveButtonProps } = useForm();

  // On submit, send the form data to the backend, which renders the PDF + HL7,
  // optionally signs the PDF, stores both and persists the record. No document
  // generation happens in the browser.
  const handleFinish = async (values: any) => {
    const { date_of_birth, upload_csv_file } = values;

    const token = localStorage.getItem("authToken");
    if (!token) {
      notification.error({ message: "Error", description: "Please login again." });
      return;
    }

    // An optional CSV of gene results becomes the PGX panel for the report.
    let pgxPanel: Array<{ gene: string; genotype: string; phenotype: string }> = [];
    const csvFile = upload_csv_file?.[0]?.originFileObj;
    if (csvFile) {
      const csvData: any[] = await new Promise((resolve, reject) => {
        Papa.parse(csvFile, {
          header: true,
          complete: (result) => resolve(result.data),
          error: (error) => reject(error),
        });
      });
      pgxPanel = csvData
        .map((row) => ({
          gene: row.Gene_Name || "",
          genotype: row.GenoType || "",
          phenotype: row.PhenoType || "",
        }))
        .filter((row) => row.gene && row.genotype);
    }

    const payload = {
      patient: {
        sampleReferenceNumber: values.test_case_id,
        patientName: values.patient_name,
        dateOfBirth: date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : "",
        sex: values.sex,
        mrn: values.mrn,
        ethnicity: values.ethnicity,
        specimenType: values.specimen_type,
        physicianName: values.physician_name,
        disease: values.disease,
      },
      pgxPanel,
    };

    try {
      const response = await fetch(`${API_URL}/lab-tests/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let serverMessage = response.statusText;
        try {
          const body = await response.json();
          serverMessage = body.message || serverMessage;
        } catch {
          // response had no JSON body
        }
        throw new Error(serverMessage);
      }

      notification.success({
        message: "Success",
        description: "Lab test report generated!",
      });

      navigate("/lab-tests");
      return values;
    } catch (error: any) {
      console.error("Error creating record:", error);
      notification.error({
        message: "Error",
        description: error.message || "Failed to generate report",
      });
      throw error;
    }
  };

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} onFinish={handleFinish} layout="vertical">
        <Row gutter={16}>
          {/* Kolom 1 */}
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
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Choose date" />
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

          {/* Kolom 2 */}
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
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Choose date" />
            </Form.Item>
            <Form.Item label="Reviewed By" name="reviewer_name">
              <Input placeholder="Example: Dr. Ong Kiat Hoe" />
            </Form.Item>
          </Col>

          {/* Kolom 3 */}
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
              getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
            >
              <Upload name="file" action="/upload.do" listType="text">
                <Button icon={<UploadOutlined />}>Upload CSV</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Create>
  );
};
