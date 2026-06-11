import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Card, Spin, Alert, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { getLabTestFileObjectUrl } from "../../utils/download";

const PdfViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  const recordId = searchParams.get("id");

  useEffect(() => {
    if (!recordId) {
      setError("Missing report id");
      setLoading(false);
      return;
    }

    let revokedUrl: string | null = null;

    // Fetch the PDF through the authenticated API (the bearer token can't be
    // attached to a bare <iframe> request), then preview it via an object URL.
    getLabTestFileObjectUrl(recordId, "pdf")
      .then((url) => {
        revokedUrl = url;
        setObjectUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load PDF:", err);
        setError("Failed to load PDF. Please make sure you are logged in.");
        setLoading(false);
      });

    return () => {
      if (revokedUrl) {
        window.URL.revokeObjectURL(revokedUrl);
      }
    };
  }, [recordId]);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => window.close()}
        style={{ marginBottom: "16px" }}
      >
        Close Viewer
      </Button>

      <Card title="PDF Viewer" bordered={false}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <p>Loading PDF...</p>
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <div style={{ height: "800px", width: "100%" }}>
            <iframe
              src={objectUrl ?? undefined}
              style={{ width: "100%", height: "100%", border: "none" }}
              title="PDF Viewer"
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default PdfViewer;
