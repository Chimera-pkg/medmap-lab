import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Card, Spin, Alert, Button } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const PdfViewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fileUrl = searchParams.get("url");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!fileUrl || !token) {
      setError("Missing file URL or authentication token");
      setLoading(false);
      return;
    }

    // The iframe will load the PDF directly
    setLoading(false);
  }, [fileUrl, token]);

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
              src={`${fileUrl}?token=${token}`}
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