import { List, useTable, EditButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Checkbox, Button, Modal, message, Input } from "antd";
import moment from "moment";
import { API_URL } from "../../config";
import { DeleteOutlined, FilePdfOutlined, FileTextOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CrudFilters } from "@refinedev/core";

interface ILabTest {
  id: number;
  patient_name: string;
  test_case_id: string;
  physician_name: string;
  disease: string;
  specimen_type: string;
  report_status: string;
  report_download_pdf: string;
  report_download_hl7: string;
  patient_age_group?: string;
  patient_super_population?: string;
  patient_population?: string;
  is_patient_hispanic?: boolean;
  patient_body_weight?: number;
  treatment_history_carbamazepine?: string;
  patient_id_type?: string;
  id_number?: string;
  patient_contact_number?: string;
  patient_address?: string;
  test_request_reference_number?: string;
  requester?: string;
  requester_address?: string;
  test_comment?: string;
  panel_id?: string;
  drug_group_id?: string;
  clinical_notes?: string;
  sample_reference_number?: string;
  sample_collection_date?: string;
  sample_received_date?: string;
  sample_description?: string;
  platform?: string;
  data_type?: string;
  sample_file?: string;
  created_at: string;
  updated_at: string;

}

export const PostList = () => {
  // State for search functionality
  const [searchText, setSearchText] = useState<string>("");

   const filters: CrudFilters = searchText ? [
    {
      field: "test_request_reference_number",
      operator: "eq", // exact match
      value: searchText,
    }
  ] : [];
  
  // Use useTable with proper filter configuration
  const { tableProps, tableQueryResult, setFilters } = useTable<ILabTest>({
    resource: "lab-tests",
    
  });

  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

   // Debounced search function to avoid too many API calls
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (value: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          // Set filters based on search text
          const newFilters: CrudFilters = value ? [
            {
              field: "test_request_reference_number",
              operator: "eq",
              value: value,
            }
          ] : []; // Empty array = no filters = show all data
          
          setFilters(newFilters);
        }, 300); // 300ms delay
      };
    })(),
    [setFilters]
  );

  // Update search when searchText changes
  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  // Debug: Log current state
  useEffect(() => {
    console.log("Current searchText:", searchText);
    console.log("Current table data count:", tableProps.dataSource?.length || 0);
    console.log("Is filtered:", searchText ? "Yes" : "No (showing all data)");
  }, [searchText, tableProps.dataSource]);

  // Handle search input change
  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // Clear search - this will show all data again
  const handleClearSearch = () => {
    setSearchText("");
    // Immediately clear filters to show all data
    setFilters([]);
  };

  const handleDelete = (record: ILabTest) => {
    Modal.confirm({
      title: "Are you sure you want to delete this record?",
      content: `This action will soft delete the record for ${record.patient_name}.`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await fetch(`${API_URL}/lab-tests/${record.id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
              deleted_at: new Date().toISOString(),
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to delete record");
          }

          message.success("Record soft deleted successfully");
          // Panggil refetch dari tableQueryResult
          tableQueryResult.refetch();
        } catch (error) {
          console.error("Error deleting record:", error);
          message.error("Failed to delete record");
        }
      },
    });
  };

  const handleDeleteSelected = () => {
    Modal.confirm({
      title: "Are you sure you want to delete the selected records?",
      content: `This action will delete ${selectedRowKeys.length} record(s).`,
      okText: "Yes, Delete",
      cancelText: "Cancel",
      onOk: async () => {
        try {
          const token = localStorage.getItem("authToken");
          await Promise.all(
            selectedRowKeys.map((id) =>
              fetch(`${API_URL}/lab-tests/${id}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  deleted_at: new Date().toISOString(),
                }),
              })
            )
          );

          message.success("Selected records deleted successfully");
          setSelectedRowKeys([]); // Clear selection
          tableQueryResult.refetch(); // Refresh the table
        } catch (error) {
          console.error("Error deleting records:", error);
          message.error("Failed to delete selected records");
        }
      },
    });
  };

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    // Get authentication token from localStorage
    const token = localStorage.getItem("authToken");
    
    fetch(`${fileUrl}`, {
      headers: {
        Authorization: `Bearer ${token}` // Add authentication header
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      return response.blob();
    })
    .then(blob => {
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    })
    .catch(error => {
      console.error("Error downloading file:", error);
      message.error("Failed to download file");
    });
  };


  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedKeys: React.Key[]) => {
      setSelectedRowKeys(selectedKeys as number[]);
    },
  };

  return (
    <List>
      {/* Search Bar */}
      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
       <Input.Search
          placeholder="Search by Test Request Reference Number (e.g., CR1062)..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          onClear={handleClearSearch}
          style={{ maxWidth: 600 }}
        />
        
        {/* Action Buttons */}
        <Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDeleteSelected}
            disabled={selectedRowKeys.length === 0}
          >
            Delete Selected
          </Button>
          <Button
            type="primary"
            // icon={<UploadOutlined />}
            onClick={() => navigate('/lab-tests/batch-upload')}
            style={{ marginLeft: 8 }}
          >
            Batch Upload
          </Button>
        </Space>
      </Space>
      <Table
        {...tableProps}
        rowKey="id"
        rowSelection={rowSelection} // Add row selection
      >
        <Table.Column dataIndex="patient_name" title="PATIENT NAME" />
        <Table.Column dataIndex="requester" title="REQUESTER" />
        <Table.Column dataIndex="test_request_reference_number" title="TEST REQUEST REFERENCE NUMBER" />
        <Table.Column dataIndex="specimen_type" title="SPECIMEN TYPE" />
        <Table.Column
          title="REPORT DOWNLOAD"
          render={(_, record: ILabTest) => (
            <Space>
              {record.report_download_pdf ? (
                <Space>
                  <Button
                    type="link"
                    icon={<FilePdfOutlined />}
                    onClick={() => handleFileDownload(record.report_download_pdf, `${record.test_case_id}_report.pdf`)}
                  >
                    PDF
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
                  >
                    View
                  </Button>
                </Space>
              ) : (
                <span>No PDF</span>
              )}
              {record.report_download_hl7 ? (
                <Space>
                  <Button
                    type="link"
                    icon={<FileTextOutlined />}
                    onClick={() => handleFileDownload(record.report_download_hl7, `${record.test_case_id}_report.hl7`)}
                  >
                    HL7
                  </Button>
           
                </Space>
              ) : (
                <span>No HL7</span>
              )}
            </Space>
          )}
        />
        <Table.Column
          dataIndex="created_at"
          title="DATE CREATED"
          render={(value) => moment(value).format("DD-MMM-YYYY hh:mm A")}
        />
        <Table.Column
          title="QUICK ACTIONS"
          render={(_, record: ILabTest) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Space>
          )}
        />
      </Table>
    </List>
  );
};

export default PostList;