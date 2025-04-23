import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Button, Space } from "antd";
import moment from "moment";
import { FilePdfOutlined, FileTextOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const PostShow = () => {
  const { queryResult } = useShow<any>();
  const record = queryResult?.data?.data;

  return (
    <Show>
      <Title level={5}>Patient Name</Title>
      <Text>{record?.patient_name}</Text>

      <Title level={5}>Date of Birth</Title>
      <Text>
        {record?.date_of_birth
          ? moment(record.date_of_birth).format("DD-MMM-YYYY")
          : "-"}
      </Text>

      <Title level={5}>Sex</Title>
      <Text>{record?.sex}</Text>

      <Title level={5}>MRN</Title>
      <Text>{record?.mrn}</Text>

      <Title level={5}>Ethnicity</Title>
      <Text>{record?.ethnicity}</Text>

      <Title level={5}>Specimen Collected From</Title>
      <Text>{record?.specimen_collected_from}</Text>

      <Title level={5}>Specimen Type</Title>
      <Text>{record?.specimen_type}</Text>

      <Title level={5}>Specimen ID</Title>
      <Text>{record?.specimen_id}</Text>

      <Title level={5}>Specimen Received</Title>
      <Text>
        {record?.specimen_received
          ? moment(record.specimen_received).format("DD-MMM-YYYY")
          : "-"}
      </Text>

      <Title level={5}>Test Information</Title>
      <Text>{record?.test_information}</Text>

      <Title level={5}>Lab Result Summary</Title>
      <Text>{record?.lab_result_summary}</Text>

      <Title level={5}>Physician Name</Title>
      <Text>{record?.physician_name}</Text>

      <Title level={5}>Reviewer Name</Title>
      <Text>{record?.reviewer_name}</Text>

      <Title level={5}>Test Case ID</Title>
      <Text>{record?.test_case_id}</Text>

      <Title level={5}>Disease</Title>
      <Text>{record?.disease}</Text>

      <Title level={5}>Report Status</Title>
      <Text>{record?.report_status}</Text>

      <Title level={5}>Created At</Title>
      <Text>
        {record?.created_at
          ? moment(record.created_at).format("DD-MMM-YYYY hh:mm A")
          : "-"}
      </Text>

      <Title level={5}>Updated At</Title>
      <Text>
        {record?.updated_at
          ? moment(record.updated_at).format("DD-MMM-YYYY hh:mm A")
          : "-"}
      </Text>

      <Title level={5}>Download Links</Title>
      <Space>
        {record?.report_download_pdf && (
          <Button
            type="link"
            icon={<FilePdfOutlined />}
            href={record.report_download_pdf}
            target="_blank"
          >
            Download PDF
          </Button>
        )}
        {record?.report_download_hl7 && (
          <Button
            type="link"
            icon={<FileTextOutlined />}
            href={record.report_download_hl7}
            target="_blank"
          >
            Download HL7
          </Button>
        )}
      </Space>
    </Show>
  );
};