import React, { useState, useEffect } from 'react';
import { Card, Descriptions, Alert, Spin, Button } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { cmxVerifyPdf, CHAINMARKX_USER_ID } from '../../utils/chainmarkx';

const VerifyPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const docId = searchParams.get('doc');
  const hash = searchParams.get('hash');
  const block = searchParams.get('block');

  useEffect(() => {
    if (docId && hash && block) {
      setVerificationResult({
        documentId: docId,
        hash: hash,
        block: block,
        status: 'info'
      });
    }
  }, [docId, hash, block]);

  const handleFileUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await cmxVerifyPdf(CHAINMARKX_USER_ID, file);
      setVerificationResult({
        ...result,
        status: 'success'
      });
    } catch (err: any) {
      setError(err.message);
      setVerificationResult({
        status: 'error',
        message: err.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Blockchain Verification</h1>
      
      {verificationResult && (
        <Card title="Document Information" className="mb-4">
          <Descriptions bordered>
            <Descriptions.Item label="Document ID">
              {verificationResult.documentId}
            </Descriptions.Item>
            <Descriptions.Item label="Hash">
              {verificationResult.hash}
            </Descriptions.Item>
            <Descriptions.Item label="Block">
              {verificationResult.block}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      <Card title="Upload PDF for Verification" className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          disabled={loading}
        />
        {loading && <Spin className="ml-4" />}
      </Card>

      {verificationResult?.status === 'success' && (
        <Alert
          message="Verification Successful"
          description="This PDF has been verified and is authentic."
          type="success"
          showIcon
        />
      )}

      {verificationResult?.status === 'error' && (
        <Alert
          message="Verification Failed"
          description={verificationResult.message || "This file could not be verified. It may have been tampered with or was not registered."}
          type="error"
          showIcon
        />
      )}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      )}
    </div>
  );
};

export default VerifyPage;
