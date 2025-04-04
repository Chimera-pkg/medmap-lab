import { List, useTable, EditButton } from "@refinedev/antd";
import { Table, Space, Checkbox, Button, Modal, message } from "antd";
import moment from "moment";
import { API_URL } from "../../config";
import { DeleteOutlined } from "@ant-design/icons";

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

export const PostList = () => {
  // Gunakan tableQueryResult untuk refetch
  const { tableProps, tableQueryResult } = useTable<ILabTest>({
    resource: "lab-tests",
  });

  const handleDelete = (record: ILabTest) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      content: `This action will soft delete the record for ${record.patient_name}.`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const response = await fetch(`${API_URL}/lab-tests/${record.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              deleted_at: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to delete record");
          }

          message.success("Record soft deleted successfully");
          // Panggil refetch dari tableQueryResult
          tableQueryResult.refetch();
        } catch (error) {
          console.error("Error deleting record:", error);
          message.error("Failed to delete record");
        }
      },
    });
  };

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="Select"
          render={() => <Checkbox />}
        />
        <Table.Column dataIndex="patient_name" title="PATIENT NAME" />
        <Table.Column dataIndex="test_case_id" title="TEST CASE ID" />
        <Table.Column dataIndex="physician_name" title="PHYSICIAN NAME" />
        <Table.Column dataIndex="disease" title="DISEASE" />
        <Table.Column dataIndex="specimen_type" title="SPECIMEN TYPE" />
        <Table.Column
          title="REPORT DOWNLOAD"
          render={() => (
            <Space>
              <a
                href="/path/to/report.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                PDF
              </a>
              <a
                href="/path/to/report.hl7"
                target="_blank"
                rel="noopener noreferrer"
              >
                HL7
              </a>
            </Space>
          )}
        />
        <Table.Column
          dataIndex="created_at"
          title="DATE CREATED"
          render={(value) => moment(value).format("DD-MMM-YYYY hh:mm A")}
        />
        <Table.Column
          title="QUICK ACTIONS"
          render={(_, record: ILabTest) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
            />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default PostList;
