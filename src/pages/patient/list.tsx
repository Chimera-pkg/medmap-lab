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
  title="Risk"
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
        <Table.Column dataIndex="title" title="Drug Name" />
        <Table.Column dataIndex="title" title="Doseage" />
        <Table.Column dataIndex="title" title="Genetic Interaction" />
        <Table.Column dataIndex="title" title="Evidence" />
        <Table.Column dataIndex="title" title="Interactions" />
        <Table.Column dataIndex="title" title="Quick Actions" />
        
      </Table>
    </List>
  );
};
