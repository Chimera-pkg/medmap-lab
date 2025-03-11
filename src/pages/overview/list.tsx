import { useMany } from "@refinedev/core";

import {
  List,
  TextField,
  useTable,
  EditButton,
  ShowButton,
} from "@refinedev/antd";

import { Table, Space } from "antd";

import type { IPost, ICategory } from "../../interfaces";

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
        <Table.Column dataIndex="id" title="ID" />
        <Table.Column dataIndex="title" title="Patient name" />
        <Table.Column dataIndex="title" title="Test case ID" />
        <Table.Column dataIndex="title" title="Physician name" />
        <Table.Column dataIndex="title" title="Disease" />
        <Table.Column dataIndex="title" title="Specimmen Type" />
        <Table.Column
          dataIndex={["category", "id"]}
          title="Reports Download"
          render={(value) => {
            if (isLoading) {
              return <TextField value="Loading..." />;
            }

            return (
              <TextField
                value={data?.data.find((item) => item.id === value)?.title}
              />
            );
          }}
        />
        <Table.Column dataIndex="title" title="Reports Download" />

        <Table.Column<IPost>
          title="Quick Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};
