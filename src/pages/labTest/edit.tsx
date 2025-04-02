import React from "react";
import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, Select } from "antd";

// Define interface to match the API response structure
interface ILabTest {
  id: number;
  patient_name: string;
  test_case_id: string;
  physician_name: string;
  disease: string;
  specimen_type: string;
  report_status: string;
  created_at: string;
  updated_at: string;
}

export const PostEdit = () => {
  const { formProps, saveButtonProps } = useForm<ILabTest>();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Patient Name"
          name="patient_name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Test Case ID"
          name="test_case_id"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Physician Name"
          name="physician_name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Disease"
          name="disease"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Specimen Type"
          name="specimen_type"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Report Status"
          name="report_status"
          rules={[{ required: true }]}
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
    </Edit>
  );
};