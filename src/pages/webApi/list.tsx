import { List, useTable } from "@refinedev/antd";
import { Table, Button, Space, message } from "antd";
import { CopyOutlined } from "@ant-design/icons";
import React from "react";

interface ILabTest {
  id: number;
  patient_name: string;
  test_case_id: string;
  report_download_pdf: string;
  report_download_hl7: string;
}

export const WebApiList = () => {
  const { tableProps } = useTable<ILabTest>({
    resource: "lab-tests",
  });

  const token = localStorage.getItem("authToken") || "";

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  return (
    <List>
      <Table {...tableProps} rowKey="id" pagination={false}>
        <Table.Column dataIndex="test_case_id" title="Test Case ID" />
        <Table.Column dataIndex="patient_name" title="Patient Name" />
        <Table.Column
          title="Web API PDF URL"
          render={(_, record: ILabTest) => {
            const url = record.report_download_pdf
              ? `${record.report_download_pdf}?token=${token}`
              : "";
            return url ? (
              <Space>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => handleCopy(url)}
                />
              </Space>
            ) : (
              <span>-</span>
            );
          }}
        />
        <Table.Column
          title="Web API HL7 URL"
          render={(_, record: ILabTest) => {
            const url = record.report_download_hl7
              ? `${record.report_download_hl7}?token=${token}`
              : "";
            return url ? (
              <Space>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => handleCopy(url)}
                />
              </Space>
            ) : (
              <span>-</span>
            );
          }}
        />
      </Table>
    </List>
  );
};

export default WebApiList;