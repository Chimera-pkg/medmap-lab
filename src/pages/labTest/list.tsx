import { List, useTable, EditButton } from "@refinedev/antd";
import { Table, Space, Checkbox, Button } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import moment from "moment";

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

export const PostList = () => {
  // Use ILabTest interface instead of IPost
  const { tableProps } = useTable<ILabTest>({
    resource: "lab-tests",
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="Select"
          render={(value) => <Checkbox />}
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
              <a href="/path/to/report.pdf" target="_blank" rel="noopener noreferrer">
                PDF
              </a>
              <a href="/path/to/report.hl7" target="_blank" rel="noopener noreferrer">
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
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <Button
                type="link"
                danger
                onClick={() => {
                  console.log("Delete clicked for record:", record);
                }}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
    </List>
  );
};