import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Card, Spin, Alert, Button, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

const { Text } = Typography;

const Hl7Viewer: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  
  const fileUrl = searchParams.get("url");
  const token = searchParams.get("token");

  useEffect(() => {
    if (!fileUrl || !token) {
      setError("Missing file URL or authentication token");
      setLoading(false);
      return;
    }

    // Fetch the HL7 data with authentication
    fetch(fileUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to load HL7 data");
      }
      return response.json();
    })
    .then(jsonData => {
      setData(jsonData);
      setLoading(false);
    })
    .catch(err => {
      setError(err.message);
      setLoading(false);
    });
  }, [fileUrl, token]);

  const renderJsonData = (jsonData: any, indent = 0) => {
    return Object.entries(jsonData).map(([key, value]) => {
      const style = { marginLeft: `${indent * 20}px`, marginBottom: '8px' };
      
      if (value !== null && typeof value === 'object') {
        return (
          <div key={key} style={style}>
            <Text strong>{key}:</Text>
            <div style={{ marginTop: '4px' }}>
              {renderJsonData(value, indent + 1)}
            </div>
          </div>
        );
      } else {
        return (
          <div key={key} style={style}>
            <Text strong>{key}:</Text> <Text>{String(value)}</Text>
          </div>
        );
      }
    });
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={() => window.close()}
        style={{ marginBottom: "16px" }}
      >
        Close Viewer
      </Button>
      
      <Card title="HL7 Viewer" bordered={false}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
            <p>Loading HL7 data...</p>
          </div>
        ) : error ? (
          <Alert message="Error" description={error} type="error" showIcon />
        ) : (
          <div style={{ overflow: "auto", maxHeight: "800px" }}>
            {data ? renderJsonData(data) : <Text>No data available</Text>}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Hl7Viewer;