import { List } from "@refinedev/antd";
import { Table, Space, Button } from "antd";
import { FilePdfOutlined, FileTextOutlined } from "@ant-design/icons";
import { API_URL } from "../../config";
import React from "react";

interface IWebApiItem {
  test_case_id: string;
  patient_name: string;
}

function getPDFbyTestID(testID: string, authToken: string) {
  return `${API_URL}/lab-tests/pdf/${testID}?token=${authToken}`;
}

function getHL7byTestID(testID: string, authToken: string) {
  return `${API_URL}/lab-tests/hl7/${testID}?token=${authToken}`;
}

export const WebApiList = () => {
  const [data, setData] = React.useState<IWebApiItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const token = localStorage.getItem("authToken");
    fetch(`${API_URL}/lab-tests`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data || []);
        setLoading(false);
      });
  }, []);

  const token = localStorage.getItem("authToken") || "";

  return (
    <List>
      <Table
        dataSource={data}
        loading={loading}
        rowKey="test_case_id"
        pagination={false}
      >
        <Table.Column dataIndex="test_case_id" title="Test Case ID" />
        <Table.Column dataIndex="patient_name" title="Patient Name" />
        <Table.Column
          title="PDF API"
          render={(_, record: IWebApiItem) => (
            <a
              href={getPDFbyTestID(record.test_case_id, token)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon={<FilePdfOutlined />}>PDF API</Button>
            </a>
          )}
        />
        <Table.Column
          title="HL7 API"
          render={(_, record: IWebApiItem) => (
            <a
              href={getHL7byTestID(record.test_case_id, token)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon={<FileTextOutlined />}>HL7 API</Button>
            </a>
          )}
        />
      </Table>
    </List>
  );
};

export default WebApiList;