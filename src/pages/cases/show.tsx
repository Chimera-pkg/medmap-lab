import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography } from "antd";
import moment from "moment";

const { Title, Text } = Typography;

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

export const PostShow = () => {
  const { queryResult } = useShow<ILabTest>();
  const record = queryResult?.data?.data;

  return (
    <Show>
      <Title level={5}>Patient Name</Title>
      <Text>{record?.patient_name}</Text>

      <Title level={5}>Test Case ID</Title>
      <Text>{record?.test_case_id}</Text>

      <Title level={5}>Physician Name</Title>
      <Text>{record?.physician_name}</Text>

      <Title level={5}>Disease</Title>
      <Text>{record?.disease}</Text>

      <Title level={5}>Specimen Type</Title>
      <Text>{record?.specimen_type}</Text>

      <Title level={5}>Report Status</Title>
      <Text>{record?.report_status}</Text>
      
      <Title level={5}>Created At</Title>
      <Text>{record?.created_at ? moment(record.created_at).format("DD-MMM-YYYY hh:mm A") : "-"}</Text>
      
      <Title level={5}>Updated At</Title>
      <Text>{record?.updated_at ? moment(record.updated_at).format("DD-MMM-YYYY hh:mm A") : "-"}</Text>
    </Show>
  );
};