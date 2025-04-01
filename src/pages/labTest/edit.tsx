import React from "react";

import { Edit, useForm } from "@refinedev/antd";

import { Form, Input, Select } from "antd";

export const PostEdit = () => {
  const { formProps, saveButtonProps } = useForm();

  return (
    <Edit saveButtonProps={saveButtonProps}>
      <Form {...formProps} layout="vertical">
        <Form.Item
          label="Patient Name"
          name="patientName"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Test Case ID"
          name="testCaseId"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Physician Name"
          name="physicianName"
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
          name="specimenType"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Report Status"
          name="reportStatus"
          rules={[{ required: true }]}
        >
          <Select
            options={[
              { label: "Pending", value: "pending" },
              { label: "Completed", value: "completed" },
            ]}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};