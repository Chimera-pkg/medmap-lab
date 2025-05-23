import React from "react";
import { Typography, Space } from "antd";

const { Title, Paragraph, Text } = Typography;

export const WebApiDocumentation: React.FC = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Typography>
        <Title level={2}>Web API Documentation for Developers</Title>
        <Paragraph>
          The Web API provides endpoints to generate and retrieve <Text strong>PDF</Text> and <Text strong>HL7</Text> reports for lab tests. Developers can use these APIs to integrate lab report generation and retrieval into their applications.
        </Paragraph>

        <Title level={3}>Base URL</Title>
        <Paragraph>
          The base URL for all API requests is defined in the configuration file:
          <br />
          <Text code>http://122.11.173.11:10868/v1</Text>
        </Paragraph>

        <Title level={3}>Endpoints</Title>
        <Title level={4}>1. Generate PDF Report</Title>
        <Paragraph>
          <Text strong>Endpoint:</Text> <Text code>/lab-tests/pdf/:test_case_id</Text>
          <br />
          <Text strong>Method:</Text> <Text code>GET</Text>
          <br />
          <Text strong>Description:</Text> Retrieves the PDF report for a given Test Case ID.
        </Paragraph>
        <Title level={5}>Request Parameters</Title>
        <Paragraph>
          <ul>
            <li>
              <Text strong>test_case_id</Text> (String): The unique ID of the lab test.
            </li>
            <li>
              <Text strong>token</Text> (String): Authentication token (query param).
            </li>
          </ul>
        </Paragraph>
        <Title level={5}>Example Request</Title>
        <Paragraph>
          <Text code>
            GET http://122.11.173.11:10868/v1/lab-tests/pdf/T12345?token=Mjk.3-kYR8q30BE_IhGxv6w-vI9S73AhxsBPMs0KUD7WvM8qY0hERfm2nKibZIAR
          </Text>
        </Paragraph>

        <Title level={4}>2. Generate HL7 Report</Title>
        <Paragraph>
          <Text strong>Endpoint:</Text> <Text code>/lab-tests/hl7/:test_case_id</Text>
          <br />
          <Text strong>Method:</Text> <Text code>GET</Text>
          <br />
          <Text strong>Description:</Text> Retrieves the HL7 report for a given Test Case ID.
        </Paragraph>
        <Title level={5}>Request Parameters</Title>
        <Paragraph>
          <ul>
            <li>
              <Text strong>test_case_id</Text> (String): The unique ID of the lab test.
            </li>
            <li>
              <Text strong>token</Text> (String): Authentication token (query param).
            </li>
          </ul>
        </Paragraph>
        <Title level={5}>Example Request</Title>
        <Paragraph>
          <Text code>
            GET http://122.11.173.11:10868/v1/lab-tests/hl7/T12345?token=Mjk.3-kYR8q30BE_IhGxv6w-vI9S73AhxsBPMs0KUD7WvM8qY0hERfm2nKibZIAR
          </Text>
        </Paragraph>

        <Title level={3}>Authentication</Title>
        <Paragraph>
          <Text strong>Token:</Text> All requests require an authentication token.
          <br />
          The token must be included as a query parameter in the URL:
          <br />
          <Text code>?token=&lt;your-auth-token&gt;</Text>
        </Paragraph>
        <Paragraph>
          <Text strong>Example Token:</Text> <Text code>Mjk.3-kYR8q30BE_IhGxv6w-vI9S73AhxsBPMs0KUD7WvM8qY0hERfm2nKibZIAR</Text>
        </Paragraph>

        <Title level={3}>Error Handling</Title>
        <Paragraph>
          <Text strong>Common Errors:</Text>
          <ul>
            <li>
              <Text strong>400:</Text> Bad Request - Invalid Test Case ID.
            </li>
            <li>
              <Text strong>401:</Text> Unauthorized - Missing or invalid authentication token.
            </li>
            <li>
              <Text strong>404:</Text> Not Found - Test Case ID not found.
            </li>
            <li>
              <Text strong>500:</Text> Internal Server Error - Server encountered an error.
            </li>
          </ul>
        </Paragraph>
        <Title level={5}>Example Error Response</Title>
        <Paragraph>
          <Text code>
            {"{"}
            <br />
            &nbsp;&nbsp;"status": 401,
            <br />
            &nbsp;&nbsp;"message": "Unauthorized"
            <br />
            {"}"}
          </Text>
        </Paragraph>

        <Title level={3}>Useful Links</Title>
        <Paragraph>
          <ul>
            <li>
              <Text strong>API Base URL:</Text>{" "}
              <Text code>http://122.11.173.11:10868/v1</Text>
            </li>
            <li>
              <Text strong>PDF Endpoint:</Text>{" "}
              <Text code>http://122.11.173.11:10868/v1/lab-tests/pdf/:test_case_id</Text>
            </li>
            <li>
              <Text strong>HL7 Endpoint:</Text>{" "}
              <Text code>http://122.11.173.11:10868/v1/lab-tests/hl7/:test_case_id</Text>
            </li>
          </ul>
        </Paragraph>
      </Typography>
    </div>
  );
};

export default WebApiDocumentation;