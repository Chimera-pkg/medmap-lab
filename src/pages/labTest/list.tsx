import { List, useTable, EditButton, ShowButton } from "@refinedev/antd";
import { Table, Space, Button, Modal, message, Input } from "antd";
import moment from "moment";
import { API_URL } from "../../config";
import { DeleteOutlined, FilePdfOutlined, FileTextOutlined, EyeOutlined, SearchOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useList } from "@refinedev/core";
import debounce from "lodash/debounce";

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
  const [searchValue, setSearchValue] = useState<string>("");
  const [filteredData, setFilteredData] = useState<ILabTest[]>([]);
  
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // Main table data - always fetch all data
  const { tableProps, tableQueryResult } = useTable<ILabTest>({
    resource: "lab-tests",
  });

  // Search functionality using useList with filters
  const { refetch: refetchSearchResults } = useList<ILabTest>({
    resource: "lab-tests",
    config: {
      filters: searchValue.trim() ? [
        {
          field: "test_request_reference_number",
          operator: "contains",
          value: searchValue.trim(),
        },
        {
          field: "patient_name",
          operator: "contains", 
          value: searchValue.trim(),
        }
      ] : [],
    },
    queryOptions: {
      enabled: false, // Only fetch when we trigger refetch
      onSuccess: (data) => {
        setFilteredData(data.data);
      },
    },
  });

  // Debounced search function
  const debouncedSearch = debounce((value: string) => {
    if (value.trim()) {
      refetchSearchResults();
    } else {
      // If search is empty, use original table data
      setFilteredData([...(tableProps.dataSource || [])]);
    }
  }, 500);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    debouncedSearch(value);
  };

  // Handle search button click
  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (value.trim()) {
      refetchSearchResults();
    } else {
      setFilteredData([...(tableProps.dataSource || [])]);
    }
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchValue("");
    setFilteredData([...(tableProps.dataSource || [])]);
  };

  // Update filtered data when main table data changes
  useEffect(() => {
    if (!searchValue.trim()) {
      setFilteredData([...(tableProps.dataSource || [])]);
    }
  }, [tableProps.dataSource, searchValue]);

  // Initial load - set filtered data to all data
  useEffect(() => {
    if (tableProps.dataSource && !searchValue.trim()) {
      setFilteredData([...tableProps.dataSource]);
    }
  }, [tableProps.dataSource]);

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
          setSelectedRowKeys([]);
          tableQueryResult.refetch();
        } catch (error) {
          console.error("Error deleting records:", error);
          message.error("Failed to delete selected records");
        }
      },
    });
  };

  const handleFileDownload = (fileUrl: string, fileName: string) => {
    const token = localStorage.getItem("authToken");
    
    fetch(`${fileUrl}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error("Failed to download file");
      }
      return response.blob();
    })
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
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

  // Create modified table props with filtered data
  const modifiedTableProps = {
    ...tableProps,
    dataSource: filteredData,
  };

  return (
    <List>
      <Space style={{ marginBottom: 16, width: '100%' }} direction="vertical">
        
        {/* Action Buttons */}
        <Space>
          <Input.Search
            placeholder="Search by Patient Name or Test Request Reference Number"
            allowClear
            enterButton={<SearchOutlined />}
            size="middle"
            value={searchValue}
            onChange={(e) => handleSearchChange(e.target.value)}
            onSearch={handleSearch}
            onClear={handleClearSearch}
            style={{ width: 450 }}
          />
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
            onClick={() => navigate('/lab-tests/batch-upload')}
            style={{ marginLeft: 8 }}
          >
            Batch Upload
          </Button>
        </Space>
      </Space>
      
      <Table
        {...modifiedTableProps}
        rowKey="id"
        rowSelection={rowSelection}
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