import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";

const { Title, Text } = Typography;

export const PostShow = () => {
  const { queryResult } = useShow();
  const record = queryResult?.data?.data;

  return (
    <Show>
      <Title level={5}>Patient Name</Title>
      <Text>{record?.patientName}</Text>

      <Title level={5}>Test Case ID</Title>
      <Text>{record?.testCaseId}</Text>

      <Title level={5}>Physician Name</Title>
      <Text>{record?.physicianName}</Text>

      <Title level={5}>Disease</Title>
      <Text>{record?.disease}</Text>

      <Title level={5}>Specimen Type</Title>
      <Text>{record?.specimenType}</Text>

      <Title level={5}>Report Status</Title>
      <Text>{record?.reportStatus}</Text>
    </Show>
  );
};