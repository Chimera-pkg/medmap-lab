import { Show } from "@refinedev/antd";
import { useShow } from "@refinedev/core";
import { Typography, Button, Space, Row, Col, Card, Tag, Divider } from "antd";
import moment from "moment";
import { FilePdfOutlined, FileTextOutlined, EyeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

export const PostShow = () => {
  const { queryResult } = useShow<any>();
  const record = queryResult?.data?.data;

  return (
    <Show>
      <Row gutter={[16, 16]}>
        {/* Patient Information */}
        <Col span={8}>
          <Card title="Patient Information" size="small">
            <Title level={5}>Patient Name</Title>
            <Text>{record?.patient_name}</Text>
            <Divider />

            <Title level={5}>Patient Last Name</Title>
            <Text>{record?.patient_last_name || "-"}</Text>
            <Divider />

            <Title level={5}>Date of Birth</Title>
            <Text>
              {record?.date_of_birth
                ? moment(record.date_of_birth).format("DD-MMM-YYYY")
                : "-"}
            </Text>
            <Divider />

            <Title level={5}>Sex</Title>
            <Text>{record?.sex}</Text>
            <Divider />

            <Title level={5}>MRN</Title>
            <Text>{record?.mrn}</Text>
            <Divider />

            <Title level={5}>Ethnicity</Title>
            <Text>{record?.ethnicity}</Text>
            <Divider />

            <Title level={5}>Age Group</Title>
            <Text>{record?.patient_age_group || "-"}</Text>
            <Divider />

            <Title level={5}>Super Population</Title>
            <Text>{record?.patient_super_population || "-"}</Text>
            <Divider />

            <Title level={5}>Population</Title>
            <Text>{record?.patient_population || "-"}</Text>
            <Divider />

            <Title level={5}>Hispanic/Latino</Title>
            <Tag color={record?.is_patient_hispanic ? "green" : "red"}>
              {record?.is_patient_hispanic ? "Yes" : "No"}
            </Tag>
            <Divider />

            <Title level={5}>Body Weight (kg)</Title>
            <Text>{record?.patient_body_weight || "-"}</Text>
            <Divider />

            <Title level={5}>Treatment History (Carbamazepine)</Title>
            <Text>{record?.treatment_history_carbamazepine || "-"}</Text>
            <Divider />

            <Title level={5}>Patient ID Type</Title>
            <Text>{record?.patient_id_type || "-"}</Text>
            <Divider />

            <Title level={5}>ID Number</Title>
            <Text>{record?.id_number || "-"}</Text>
            <Divider />

            <Title level={5}>Contact Number</Title>
            <Text>{record?.patient_contact_number || "-"}</Text>
            <Divider />

            <Title level={5}>Address</Title>
            <Text>{record?.patient_address || "-"}</Text>
          </Card>
        </Col>

        {/* Test & Request Information */}
        <Col span={8}>
          <Card title="Test & Request Information" size="small">
            <Title level={5}>Test Case ID</Title>
            <Text>{record?.test_case_id}</Text>
            <Divider />

            <Title level={5}>Test Request Reference Number</Title>
            <Text>{record?.test_request_reference_number || "-"}</Text>
            <Divider />

            <Title level={5}>Requester</Title>
            <Text>{record?.requester || "-"}</Text>
            <Divider />

            <Title level={5}>Requester Address</Title>
            <Text>{record?.requester_address || "-"}</Text>
            <Divider />

            <Title level={5}>Physician Name</Title>
            <Text>{record?.physician_name}</Text>
            <Divider />

            <Title level={5}>Disease</Title>
            <Text>{record?.disease}</Text>
            <Divider />

            <Title level={5}>Test Comment</Title>
            <Text>{record?.test_comment || "-"}</Text>
            <Divider />

            <Title level={5}>Panel ID</Title>
            <Text>{record?.panel_id || "-"}</Text>
            <Divider />

            <Title level={5}>Drug Group ID</Title>
            <Text>{record?.drug_group_id || "-"}</Text>
            <Divider />

            <Title level={5}>Clinical Notes</Title>
            <Text>{record?.clinical_notes || "-"}</Text>
            <Divider />

            <Title level={5}>Reviewer Name</Title>
            <Text>{record?.reviewer_name || "-"}</Text>
            <Divider />

            <Title level={5}>Test Information</Title>
            <Text>{record?.test_information}</Text>
            <Divider />

            <Title level={5}>Lab Result Summary</Title>
            <Text>{record?.lab_result_summary}</Text>
          </Card>
        </Col>

        {/* Sample & Specimen Information */}
        <Col span={8}>
          <Card title="Sample & Specimen Information" size="small">
            <Title level={5}>Sample Reference Number</Title>
            <Text>{record?.sample_reference_number || "-"}</Text>
            <Divider />

            <Title level={5}>Sample Collection Date</Title>
            <Text>
              {record?.sample_collection_date
                ? moment(record.sample_collection_date).format("DD-MMM-YYYY")
                : "-"}
            </Text>
            <Divider />

            <Title level={5}>Sample Received Date</Title>
            <Text>
              {record?.sample_received_date
                ? moment(record.sample_received_date).format("DD-MMM-YYYY")
                : "-"}
            </Text>
            <Divider />

            <Title level={5}>Sample Description</Title>
            <Text>{record?.sample_description || "-"}</Text>
            <Divider />

            <Title level={5}>Platform</Title>
            <Text>{record?.platform || "-"}</Text>
            <Divider />

            <Title level={5}>Data Type</Title>
            <Tag color="purple">{record?.data_type || "-"}</Tag>
            <Divider />

            <Title level={5}>Sample File</Title>
            <Text>{record?.sample_file || "-"}</Text>
            <Divider />

            <Title level={5}>Specimen Collected From</Title>
            <Text>{record?.specimen_collected_from}</Text>
            <Divider />

            <Title level={5}>Specimen Type</Title>
            <Text>{record?.specimen_type}</Text>
            <Divider />

            <Title level={5}>Specimen ID</Title>
            <Text>{record?.specimen_id}</Text>
            <Divider />

            <Title level={5}>Specimen Received</Title>
            <Text>
              {record?.specimen_received
                ? moment(record.specimen_received).format("DD-MMM-YYYY")
                : "-"}
            </Text>
          </Card>
        </Col>
      </Row>

      {/* System Information */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="System Information" size="small">
            <Row gutter={[16, 16]}>
              <Col span={6}>
                <Title level={5}>Report Status</Title>
                <Tag color="green">{record?.report_status || "Completed"}</Tag>
              </Col>
              <Col span={6}>
                <Title level={5}>Created At</Title>
                <Text>
                  {record?.created_at
                    ? moment(record.created_at).format("DD-MMM-YYYY hh:mm A")
                    : "-"}
                </Text>
              </Col>
              <Col span={6}>
                <Title level={5}>Updated At</Title>
                <Text>
                  {record?.updated_at
                    ? moment(record.updated_at).format("DD-MMM-YYYY hh:mm A")
                    : "-"}
                </Text>
              </Col>
              <Col span={6}>
                <Title level={5}>Download Links</Title>
                <Space direction="vertical">
                  {record?.report_download_pdf && (
                    <Space>
                      <Button
                        type="link"
                        icon={<FilePdfOutlined />}
                        href={record.report_download_pdf}
                        target="_blank"
                        size="small"
                      >
                        Download PDF
                      </Button>
                      <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => {
                          const token = localStorage.getItem("authToken");
                          const fileUrl = `${record.report_download_pdf}`;
                          const viewerUrl = `/pdf-viewer?url=${encodeURIComponent(fileUrl)}&token=${token}`;
                          window.open(viewerUrl, '_blank');
                        }}
                        size="small"
                      >
                        View PDF
                      </Button>
                    </Space>
                  )}
                  {record?.report_download_hl7 && (
                    <Button
                      type="link"
                      icon={<FileTextOutlined />}
                      href={record.report_download_hl7}
                      target="_blank"
                      size="small"
                    >
                      Download HL7
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Show>
  );
};