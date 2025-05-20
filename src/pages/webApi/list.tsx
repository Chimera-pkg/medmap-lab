import React, { useState } from "react";
import { List } from "@refinedev/antd";
import { Input, Button, Space, Typography, message } from "antd";
import { CopyOutlined, SearchOutlined } from "@ant-design/icons";
import { API_URL } from "../../config";

const { Text } = Typography;

interface ILabTest {
  test_case_id: string;
  patient_name: string;
  report_download_pdf?: string;
  report_download_hl7?: string;
}

export const WebApiList = () => {
  const [testCaseId, setTestCaseId] = useState("");
  const [loading, setLoading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [hl7Url, setHl7Url] = useState<string | null>(null);

  // Token langsung disisipkan
  const token = "Mjk.3-kYR8q30BE_IhGxv6w-vI9S73AhxsBPMs0KUD7WvM8qY0hERfm2nKibZIAR";

  const handleSearch = async () => {
    if (!testCaseId) {
      message.warning("Masukkan Test Case ID terlebih dahulu.");
      return;
    }

    setLoading(true);
    setPdfUrl(null);
    setHl7Url(null);

    try {
      // Generate URLs
      const pdfEndpoint = `${API_URL}/lab-tests/pdf/${encodeURIComponent(testCaseId)}`;
      const hl7Endpoint = `${API_URL}/lab-tests/hl7/${encodeURIComponent(testCaseId)}`;

      // Simpan URL ke state
      setPdfUrl(`${pdfEndpoint}?token=${token}`);
      setHl7Url(`${hl7Endpoint}?token=${token}`);

      message.success("Link berhasil dibuat.");
    } catch (err) {
      message.error("Gagal membuat link. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success("Copied to clipboard!");
  };

  return (
    <List>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input.Search
          placeholder="Masukkan Test Case ID"
          enterButton={<SearchOutlined />}
          value={testCaseId}
          onChange={(e) => setTestCaseId(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
          style={{ maxWidth: 400 }}
        />
        {pdfUrl && (
          <div style={{ marginTop: 16 }}>
            <div>
              <Text strong>PDF URL:</Text>{" "}
              <Space>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  {pdfUrl}
                </a>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => handleCopy(pdfUrl)}
                />
              </Space>
            </div>
          </div>
        )}
        {hl7Url && (
          <div style={{ marginTop: 8 }}>
            <div>
              <Text strong>HL7 URL:</Text>{" "}
              <Space>
                <a href={hl7Url} target="_blank" rel="noopener noreferrer">
                  {hl7Url}
                </a>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  onClick={() => handleCopy(hl7Url)}
                />
              </Space>
            </div>
          </div>
        )}
      </Space>
    </List>
  );
};

export default WebApiList;