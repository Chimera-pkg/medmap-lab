import { useMany } from "@refinedev/core";

import {
  List,
  TextField,
  useTable,
  EditButton,
  ShowButton,
} from "@refinedev/antd";

import { Table, Space, Checkbox } from "antd";

import type { IPost, ICategory } from "../../interfaces";
import { SettingOutlined } from "@ant-design/icons";
import { Button } from "antd/lib";
import moment from "moment";

export const PostList = () => {
  const { tableProps } = useTable<IPost>();

  const categoryIds =
    tableProps?.dataSource?.map((item) => item.category.id) ?? [];
  const { data, isLoading } = useMany<ICategory>({
    resource: "categories",
    ids: categoryIds,
    queryOptions: {
      enabled: categoryIds.length > 0,
    },
  });

  return (
    <List>
      <Table {...tableProps} rowKey="id">
        <Table.Column
          dataIndex="id"
          title="Select"
          render={(value) => <Checkbox>{value}</Checkbox>}
        />
        <Table.Column
          title="Actions"
          render={(_, record) => (
            <Space>
              <SettingOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  console.log("Settings clicked for record:", record);
                }}
              />
            </Space>
          )}
        />
        <Table.Column dataIndex="title" title="PATIENT NAME" />
        <Table.Column dataIndex="title" title="TEST CASE ID" />
        <Table.Column dataIndex="title" title="PHYSICIAN NAME" />
        <Table.Column dataIndex="title" title="DISEASE" />
        <Table.Column dataIndex="title" title="SPECIMEN TYPE" />
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
          dataIndex="dateCreated"
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
