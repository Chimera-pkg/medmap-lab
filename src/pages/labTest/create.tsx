import { Create, useForm } from "@refinedev/antd";
import { Form, Input, Select, DatePicker, Upload, Button, Row, Col, notification } from "antd";
import MDEditor from "@uiw/react-md-editor";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { generateReportBlob } from "../../utils/generateReport";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { buildHL7Message } from "../../utils/generateHl7";
import Papa from "papaparse";

export const PostCreate: React.FC = () => {
    // Misalnya untuk redirect setelah sukses
    const navigate = useNavigate();

    const { formProps, saveButtonProps } = useForm();

    // Fungsi ketika form submit (akan dijalankan secara penuh, tidak hanya save record)
    const handleFinish = async (values: any) => {
        const { date_of_birth, specimen_received, upload_csv_file } = values;

        const csvFile = upload_csv_file?.[0]?.originFileObj;
    if (!csvFile) {
        notification.error({
            message: "Error",
            description: "Please upload a valid CSV file.",
        });
        return;
    }

    const csvData: any[] = await new Promise((resolve, reject) => {
        Papa.parse(csvFile, {
            header: true,
            complete: (result) => resolve(result.data),
            error: (error) => reject(error),
        });
    });

    

    // Map the CSV data to the required format
    const testResults = csvData.map((row) => ({
        clinicalAction:  "Up dose",
        drug: row.Drug_Name || "",
        gene: row.Gene_Name ? row.Gene_Name.split(",") : [],
        genotype: row.GenoType ? row.GenoType.split(",") : [],
        phenotype: row.PhenoType ? row.PhenoType.split(",") : [],
        toxicity: row.Drug_Response_Toxicity ? row.Drug_Response_Toxicity.split(",") : [],
        dosage: row.Drug_Response_Dosage ? row.Drug_Response_Dosage.split(",") : [],
        efficacy: row.Drug_Response_Efficacy ? row.Drug_Response_Efficacy.split(",") : [],
        evidence: row.Evidence ? row.Evidence.split(",") : [],
    }));

    // Hilangkan duplikasi dalam testResults berdasarkan kombinasi kolom
const uniqueTestResults = testResults.filter((row, index, self) => {
    return (
      index ===
      self.findIndex(
        (r) =>
          r.clinicalAction === row.clinicalAction &&
          r.drug === row.drug &&
          JSON.stringify(r.gene) === JSON.stringify(row.gene) &&
          JSON.stringify(r.genotype) === JSON.stringify(row.genotype) &&
          JSON.stringify(r.phenotype) === JSON.stringify(row.phenotype) &&
          JSON.stringify(r.toxicity) === JSON.stringify(row.toxicity) &&
          JSON.stringify(r.dosage) === JSON.stringify(row.dosage) &&
          JSON.stringify(r.efficacy) === JSON.stringify(row.efficacy) &&
          JSON.stringify(r.evidence) === JSON.stringify(row.evidence)
      )
    );
  });

        // Format data untuk report
        const reportData = {
            patient: {
                "Patient Name": values.patient_name,
                "Date of Birth": date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : null,
                Sex: values.sex,
                MRN: values.mrn,
                Ethnicity: values.ethnicity || "N/A",
            },
            specimen: {
                "Specimen Type": values.specimen_type,
                "Specimen ID": values.specimen_id,
                "Specimen Collected": values.specimen_collected_from || "N/A",
                "Specimen Received": specimen_received ? dayjs(specimen_received).format("YYYY-MM-DD") : null,
            },
            orderedBy: {
                Requester: "TTSH Hospital",
                Physician: values.physician_name,
            },
            caseInfo: {
                "Test Case ID": values.test_case_id,
                "Review Status": "Final",
                "Date Accessioned": dayjs().format("YYYY-MM-DD"),
                "Date Reported": dayjs().format("YYYY-MM-DD"),
            },
            test_information: values.test_information, // Pastikan ini ada
            lab_result_summary: values.lab_result_summary,
            testResults,
        };

        try {
            // Generate PDF blob berdasarkan reportData
            const pdfBlob = await generateReportBlob(reportData);
            console.log("Generated PDF Blob:", pdfBlob);

             // Generate HL7 message using the buildHL7Message function
            const hl7Message = buildHL7Message({
                ...values,
                date_of_birth: date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : null,
                specimen_received: specimen_received ? dayjs(specimen_received).format("YYYY-MM-DD") : null,
                testResults: [
                ],  
            });

                    // Create HL7 blob
            const hl7Blob = new Blob([hl7Message], { type: "text/plain" });
            console.log("Generated HL7 Blob:", hl7Blob);

            // Tentukan nama file berdasarkan patient_name
            const patientName = values.patient_name.replace(/\s+/g, "_"); // Ganti spasi dengan underscore
            const pdfFileName = `${patientName}_Report.pdf`;
            const hl7FileName = `${patientName}_Report.hl7`;


            // Create FormData object and append files and individual fields
            const formData = new FormData();
            formData.append("report_download_pdf", pdfBlob, pdfFileName);
            formData.append("report_download_hl7", hl7Blob, hl7FileName);


            // Append setiap field secara individual agar validator backend dapat membaca
            formData.append("patient_name", values.patient_name);
            formData.append("date_of_birth", date_of_birth ? dayjs(date_of_birth).format("YYYY-MM-DD") : "");
            formData.append("sex", values.sex);
            formData.append("mrn", values.mrn);
            formData.append("ethnicity", values.ethnicity);
            formData.append("specimen_collected_from", values.specimen_collected_from);
            formData.append("specimen_type", values.specimen_type);
            formData.append("specimen_id", values.specimen_id);
            formData.append("specimen_received", specimen_received ? dayjs(specimen_received).format("YYYY-MM-DD") : "");
            formData.append("test_information", values.test_information);
            formData.append("lab_result_summary", values.lab_result_summary);
            formData.append("physician_name", values.physician_name);
            formData.append("reviewer_name", values.reviewer_name);
            formData.append("test_case_id", values.test_case_id);
            formData.append("disease", values.disease);

            // Kirim data ke endpoint yang sesuai (misalnya /lab-tests)
            const response = await fetch(`${API_URL}/lab-tests`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to upload files");
            }

            console.log("Record created successfully");

            // Setelah record tersimpan, misalnya tampilkan notifikasi sukses
            notification.success({
                message: "Sukses",
                description: "Lab test Created!",
            });

            // Dan melakukan redirect ke halaman list atau detail sesuai alur aplikasi
            navigate("/lab-tests");

            return values;
        } catch (error: any) {
            console.error("Error creating record:", error);
            notification.error({
                message: "Error",
                description: error.message || "Terjadi kesalahan ketika menyimpan data",
            });
            throw error;
        }
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} onFinish={handleFinish} layout="vertical">
                <Row gutter={16}>
                    {/* Kolom 1 */}
                    <Col span={8}>
                        <Form.Item
                            label="Patient Name"
                            name="patient_name"
                            rules={[{ required: true, message: "Patient Name is required" }]}
                        >
                            <Input placeholder="Example: John Doe" />
                        </Form.Item>
                        <Form.Item
                            label="Test Case ID"
                            name="test_case_id"
                            rules={[{ required: true, message: "Test Case ID is required" }]}
                        >
                            <Input placeholder="Example: TC-001" />
                        </Form.Item>
                        <Form.Item
                            label="Date of Birth"
                            name="date_of_birth"
                            rules={[{ required: true, message: "Date of Birth is required" }]}
                            getValueProps={(value) => ({
                                value: value ? dayjs(value) : undefined,
                            })}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Choose date" />
                        </Form.Item>
                        <Form.Item
                            label="Sex"
                            name="sex"
                            rules={[{ required: true, message: "Sex is required" }]}
                        >
                            <Select
                                placeholder="Choose gender"
                                options={[
                                    { label: "Male", value: "Male" },
                                    { label: "Female", value: "Female" },
                                ]}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Physician Name"
                            name="physician_name"
                            rules={[{ required: true, message: "Physician Name is required" }]}
                        >
                            <Input placeholder="Example: Dr Ong" />
                        </Form.Item>
                        <Form.Item
                            label="Disease"
                            name="disease"
                            rules={[{ required: true, message: "Disease is required" }]}
                        >
                            <Input placeholder="Example: Diabetes" />
                        </Form.Item>
                        <Form.Item
                            label="Ethnicity"
                            name="ethnicity"
                            rules={[{ required: true, message: "Ethnicity is required" }]}
                        >
                            <Input placeholder="Example: Hispanic" />
                        </Form.Item>
                    </Col>

                    {/* Kolom 2 */}
                    <Col span={8}>
                        <Form.Item
                            label="MRN"
                            name="mrn"
                            rules={[{ required: true, message: "MRN is required" }]}
                        >
                            <Input placeholder="MRN" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen Collected From"
                            name="specimen_collected_from"
                            rules={[{ required: true, message: "Specimen Collected From is required" }]}
                        >
                            <Input placeholder="Example: Name of hospital" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen Type"
                            name="specimen_type"
                            rules={[{ required: true, message: "Specimen Type is required" }]}
                        >
                            <Input placeholder="Example: Whole blood" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen ID"
                            name="specimen_id"
                            rules={[{ required: true, message: "Specimen ID is required" }]}
                        >
                            <Input placeholder="E.G 001 002" />
                        </Form.Item>
                        <Form.Item
                            label="Specimen Date"
                            name="specimen_received"
                            rules={[{ required: true, message: "Specimen Date is required" }]}
                            getValueProps={(value) => ({
                                value: value ? dayjs(value) : undefined,
                            })}
                        >
                            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" placeholder="Choose date" />
                        </Form.Item>
                        <Form.Item label="Reviewed By" name="reviewer_name">
                            <Input placeholder="Example: Dr. Ong Kiat Hoe" />
                        </Form.Item>
                    </Col>

                    {/* Kolom 3 */}
                    <Col span={8}>
                        <Form.Item
                            label="Test Information"
                            name="test_information"
                            rules={[{ required: true, message: "Test Information is required" }]}
                        >
                            <MDEditor />
                        </Form.Item>
                        <Form.Item
                            label="Lab Result Summary"
                            name="lab_result_summary"
                            rules={[{ required: true, message: "Lab Result Summary is required" }]}
                        >
                            <MDEditor />
                        </Form.Item>
                        <Form.Item
                            label="Upload CSV File"
                            name="upload_csv_file"
                            valuePropName="fileList"
                            getValueFromEvent={(e) =>
                                Array.isArray(e) ? e : e?.fileList
                            }
                        >
                            <Upload name="file" action="/upload.do" listType="text">
                                <Button icon={<UploadOutlined />}>Upload CSV</Button>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Create>
    );
};
