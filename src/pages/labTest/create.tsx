import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

// Define interface to match the API structure
interface ILabTest {
  patient_name: string;
  test_case_id: string;
  physician_name: string;
  disease: string;
  specimen_type: string;
  report_status: string;
}

export const PostCreate: React.FC = () => {
  const { formProps, saveButtonProps } = useForm<ILabTest>();

  return (
    <Create saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Patient Name"
          name="patient_name"
          rules={[{ required: true, message: "Patient Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Test Case ID"
          name="test_case_id"
          rules={[{ required: true, message: "Test Case ID is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Physician Name"
          name="physician_name"
          rules={[{ required: true, message: "Physician Name is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Disease"
          name="disease"
          rules={[{ required: true, message: "Disease is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Specimen Type"
          name="specimen_type"
          rules={[{ required: true, message: "Specimen Type is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Report Status"
          name="report_status"
          rules={[{ required: true, message: "Report Status is required" }]}
        >
          <Select
            options={[
              { label: "Pending", value: "Pending" },
              { label: "In Progress", value: "In Progress" },
              { label: "Completed", value: "Completed" },
            ]}
          />
        </Form.Item>
      </Form>
    </Create>
  );
};

export default PostCreate;