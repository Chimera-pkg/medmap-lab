import React, { useState } from "react";
import { Upload, Button, message, Card, Space, Table, Progress, Alert, Modal } from "antd";
import { UploadOutlined, CloudUploadOutlined, FileExcelOutlined, FileTextOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { generateReportBlob } from "../../utils/generateReport";
import { buildHL7Message } from "../../utils/generateHl7";

interface PatientData {
  sampleReferenceNumber: string;
  patientName: string;
  patientLastName?: string;
  dateOfBirth: string;
  sex: string;
  mrn: string;
  ethnicity: string;
  specimenType: string;
  physicianName: string;
  disease: string;
  // New fields to match backend validation
  patientAgeGroup?: string;
  patientSuperPopulation?: string;
  patientPopulation?: string;
  isPatientHispanic?: boolean;
  patientBodyWeight?: number;
  treatmentHistoryCarbamazepine?: string;
  patientIdType?: string;
  idNumber?: string;
  patientContactNumber?: string;
  patientAddress?: string;
  testRequestReferenceNumber?: string;
  requester?: string;
  requesterAddress?: string;
  testComment?: string;
  panelId?: string;
  drugGroupId?: string;
  clinicalNotes?: string;
  sampleReferenceNumber2?: string;
  sampleCollectionDate?: string;
  sampleReceivedDate?: string;
  sampleDescription?: string;
  platform?: string;
  dataType?: string;
  sampleFile?: string;
}

// interface LabTestResult {
//   sampleReferenceNumber: string;
//   drugName: string;
//   geneName: string;
//   genoType: string;
//   phenoType: string;
//   drugResponseToxicity: string;
//   drugResponseDosage: string;
//   drugResponseEfficacy: string;
//   evidence: string;
//   clinicalAnnotation: string;
// }

interface LabTestResult {
  sampleReferenceNumber: string;
  drugName: string;
  geneName: string;
  genoType: string;
  phenoType: string;
  drugResponseToxicity: string;
  drugResponseDosage: string;
  drugResponseEfficacy: string;
  evidence: string;
  clinicalAnnotation: string;
  pgxPanel?: Array<{
    gene: string;
    genotype: string;
    phenotype: string;
  }>;
}

interface BatchUploadData {
  patientFile: File | null;
  labResultFile: File | null;
  patientData: PatientData[];
  labResultData: LabTestResult[];
  matchedData: any[];
  validationErrors: string[];
  uploadStatus: 'idle' | 'processing' | 'success' | 'error';
  progress: number;
  currentProcessingItem: string;
}

export const BatchUpload: React.FC = () => {
  const navigate = useNavigate();
  const [batchData, setBatchData] = useState<BatchUploadData>({
    patientFile: null,
    labResultFile: null,
    patientData: [],
    labResultData: [],
    matchedData: [],
    validationErrors: [],
    uploadStatus: 'idle',
    progress: 0,
    currentProcessingItem: ''
  });

  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  // Handle Patient List File (CSV/Excel)
  
  const handlePatientFileUpload = async (file: File) => {
    try {
      
      let patientData: PatientData[] = [];
      
      if (file.name.endsWith('.csv')) {
        // Parse CSV
        patientData = await new Promise((resolve, reject) => {
          Papa.parse(file, {
            header: true,
            complete: (result) => {
              // Debug: Log the raw parsed data
              console.log("Raw CSV data:", result.data);
             
              const data = result.data.map((row: any) => {
              // Combine first and last name for patient name

              const firstName = row['Patient First Name'] || row['patient_first_name'] || row['patient.firstName'] || row['firstName'] || '';
              const lastName = row['Patient Last Name'] || row['patient_last_name'] || row['patient.lastName'] || row['lastName'] || '';
              const patientName = `${firstName} ${lastName}`.trim();

              return {
                // Basic required fields
                sampleReferenceNumber: row['Sample Reference Number'] || row['sample_reference_number'] || row['sample.sampleReferenceNumber'] || '',
                patientName: patientName,
                patientLastName: lastName,
                dateOfBirth: row['Patient Birthday'] || row['patient_birthday'] || row['patient.birthday'] || row['dob'] || '',
                sex: row['Patient Gender'] || row['patient_gender'] || row['patient.gender'] || '',
                mrn: row['Patient Medical Record Number(MRN)'] || row['patient.mrn'] || row['MRN'] || '',
                ethnicity: row['Patient Population'] || row['patient_population'] || row['patient.populationDetail'] || '',
                specimenType: row['Sample Source'] || row['sample_source'] || row['sample.sampleSource'] || '',
                physicianName: row['Physician Name'] || row['physician_name'] || row['physician'] || '',
                disease: row['Disease'] || row['disease'] || '',
                
                // Additional patient demographics
                patientAgeGroup: row['Patient Age Group'] || row['patient_age_group'] || row['patient.ageGroup'] || '',
                patientSuperPopulation: row['Patient Super Population'] || row['patient_super_population'] || row['patient.population'] || '',
                patientPopulation: row['Patient Population'] || row['patient_population'] || row['patient.populationDetail'] || '',
                isPatientHispanic: (row['Is Patient Hispanic'] || row['is_patient_hispanic'] || row['patient.hispanic'] || '') === 'Yes' || 
                                  (row['Is Patient Hispanic'] || row['is_patient_hispanic'] || row['patient.hispanic'] || '') === 'true',
                patientBodyWeight: parseFloat(row['Patient Body Weight'] || row['patient_body_weight'] || row['patient.bodyWeight'] || '0') || undefined,
                treatmentHistoryCarbamazepine: row['Treatment History of carbamazepine of Patient'] || row['treatment_history_carbamazepine'] || row['patient.treatmentHistory'] || '',
                patientIdType: row['ID type'] || row['patient_id_type'] || row['patient.idType'] || '',
                idNumber: row['ID Number'] || row['id_number'] || row['patient.idNumber'] || '',
                patientContactNumber: row['Patient Contact Number'] || row['patient_contact_number'] || row['patient.mobileNumber'] || '',
                patientAddress: row['Patient Address'] || row['patient_address'] || row['patient.address'] || '',
                
                // Test and request information
                testRequestReferenceNumber: row['Test Request Reference Number'] || row['test_request_reference_number'] || row['test.referenceNumber'] || '',
                requester: row['Requester'] || row['requester'] || row['test.sampleFromInstitution'] || '',
                requesterAddress: row['Requester Address'] || row['requester_address'] || row['test.requesterAddress'] || '',
                testComment: row['Test Comment'] || row['test_comment'] || row['test.remarks'] || '',
                panelId: row['Panel ID'] || row['panel_id'] || row['config.panelId'] || '',
                drugGroupId: row['Drug Group ID'] || row['drug_group_id'] || row['config.drugGroupId'] || '',
                clinicalNotes: row['Clinical Notes'] || row['clinical_notes'] || row['config.clinicalNotes'] || '',
                
                // Sample information
                sampleReferenceNumber2: row['Sample Reference Number'] || row['sample_reference_number'] || row['sample.sampleReferenceNumber'] || '',
                sampleCollectionDate: row['Sample Collection Date'] || row['sample_collection_date'] || row['sample.collectionDate'] || '',
                sampleReceivedDate: row['Sample Received Date'] || row['sample_received_date'] || row['sample.receivedDate'] || '',
                sampleDescription: row['Sample Description (Free Text)'] || row['sample_description'] || row['sample.description'] || '',
                platform: row['Platform'] || row['platform'] || row['sample.platform'] || '',
                dataType: row['Data type'] || row['data_type'] || row['sample.dataType'] || '',
                sampleFile: row['Sample File'] || row['sample_file'] || row['sample.fileNameR1'] || ''
              };
            });
              
              // Log processed data and filter out invalid rows
              console.log("Processed patient data:", data);
              resolve(data.filter((item: any) => item.sampleReferenceNumber && item.sampleReferenceNumber !== 'sample.sampleReferenceNumber'));
            },
            error: reject
          });
        });
      } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
        // Parse Excel
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log("Raw Excel data:", jsonData);
        
        patientData = jsonData.map((row: any) => {
        return {
          // Basic required fields
          sampleReferenceNumber: row['Sample Reference Number'] || row['sample_ref_no'] || row['SampleReferenceNumber'] || '',
          patientName: row['Patient Name'] || row['patient_name'] || row['PatientName'] || '',
          patientLastName: row['Patient Last Name'] || row['patient_last_name'] || row['PatientLastName'] || '',
          dateOfBirth: row['Date of Birth'] || row['dob'] || row['DateOfBirth'] || '',
          sex: row['Sex'] || row['gender'] || '',
          mrn: row['MRN'] || row['mrn'] || '',
          ethnicity: row['Ethnicity'] || row['ethnicity'] || '',
          specimenType: row['Specimen Type'] || row['specimen_type'] || row['SpecimenType'] || '',
          physicianName: row['Physician Name'] || row['physician'] || row['PhysicianName'] || '',
          disease: row['Disease'] || row['disease'] || '',
          
          // Additional patient demographics
          patientAgeGroup: row['Patient Age Group'] || row['patient_age_group'] || row['AgeGroup'] || '',
          patientSuperPopulation: row['Patient Super Population'] || row['patient_super_population'] || row['SuperPopulation'] || '',
          patientPopulation: row['Patient Population'] || row['patient_population'] || row['Population'] || '',
          isPatientHispanic: row['Is Patient Hispanic'] || row['is_patient_hispanic'] || row['Hispanic'] === 'true' || row['Hispanic'] === 'Yes',
          patientBodyWeight: parseFloat(row['Patient Body Weight'] || row['patient_body_weight'] || row['BodyWeight'] || '0') || undefined,
          treatmentHistoryCarbamazepine: row['Treatment History Carbamazepine'] || row['treatment_history_carbamazepine'] || row['TreatmentHistory'] || '',
          patientIdType: row['Patient ID Type'] || row['patient_id_type'] || row['IDType'] || '',
          idNumber: row['ID Number'] || row['id_number'] || row['IDNumber'] || '',
          patientContactNumber: row['Patient Contact Number'] || row['patient_contact_number'] || row['ContactNumber'] || '',
          patientAddress: row['Patient Address'] || row['patient_address'] || row['Address'] || '',
          
          // Test and request information
          testRequestReferenceNumber: row['Test Request Reference Number'] || row['test_request_reference_number'] || row['RequestRefNumber'] || '',
          requester: row['Requester'] || row['requester'] || '',
          requesterAddress: row['Requester Address'] || row['requester_address'] || row['RequesterAddress'] || '',
          testComment: row['Test Comment'] || row['test_comment'] || row['TestComment'] || '',
          panelId: row['Panel ID'] || row['panel_id'] || row['PanelID'] || '',
          drugGroupId: row['Drug Group ID'] || row['drug_group_id'] || row['DrugGroupID'] || '',
          clinicalNotes: row['Clinical Notes'] || row['clinical_notes'] || row['ClinicalNotes'] || '',
          
          // Sample information
          sampleReferenceNumber2: row['Sample Reference Number 2'] || row['sample_reference_number'] || row['SampleRefNumber'] || '',
          sampleCollectionDate: row['Sample Collection Date'] || row['sample_collection_date'] || row['CollectionDate'] || '',
          sampleReceivedDate: row['Sample Received Date'] || row['sample_received_date'] || row['ReceivedDate'] || '',
          sampleDescription: row['Sample Description'] || row['sample_description'] || row['SampleDescription'] || '',
          platform: row['Platform'] || row['platform'] || '',
          dataType: row['Data Type'] || row['data_type'] || row['DataType'] || '',
          sampleFile: row['Sample File'] || row['sample_file'] || row['SampleFile'] || ''
        };
      }).filter((item: any) => item.sampleReferenceNumber && item.sampleReferenceNumber !== 'sample.sampleReferenceNumber');
    }

      console.log("Final patient data:", patientData);
      
      setBatchData(prev => ({
        ...prev,
        patientFile: file,
        patientData,
        validationErrors: []
      }));

      message.success(`Patient file uploaded successfully. Found ${patientData.length} patients.`);
    } catch (error) {
      console.error("Error parsing patient file:", error);
      message.error('Failed to parse patient file');
    }
  };

  // Handle Lab Test Results File (TXT)
  // const handleLabResultFileUpload = async (file: File) => {
  //   try {
  //     const text = await file.text();
  //     const lines = text.split('\n');
  //     const labResultData: LabTestResult[] = [];

  //     // Debug: Log the first few lines of the file
  //     console.log("TXT file first lines:", lines.slice(0, 5));

  //     // Assuming the first line is headers
  //     const headers = lines[0].trim().split('\t');
  //     console.log("TXT headers:", headers);
      
  //     // Map header indexes
  //     const headerIndexes: Record<string, number> = {};
  //     headers.forEach((header, index) => {
  //       const normalizedHeader = header.trim().toLowerCase().replace(/\s+/g, '');
  //       headerIndexes[normalizedHeader] = index;
  //       console.log(`Header "${header}" normalized to "${normalizedHeader}" at index ${index}`);
  //     });

  //     // Find the sample reference number column index with more flexible matching
  //     // Expand possible sample reference header matches
  //     const possibleSampleRefHeaders = [
  //       'samplereferencenumber', 'samplerefno', 'sampleid', 'sample', 'samplenumber', 'referencenumber',
  //       'sample.samplereferencenumber', 'sample_reference_number'
  //     ];
      
  //     let sampleRefIndex = -1;
  //     for (const possibleHeader of possibleSampleRefHeaders) {
  //       const foundIndex = Object.keys(headerIndexes).findIndex(h => h.includes(possibleHeader));
  //       if (foundIndex >= 0) {
  //         sampleRefIndex = headerIndexes[Object.keys(headerIndexes)[foundIndex]];
  //         console.log(`Found sample reference column at index ${sampleRefIndex} with header ${Object.keys(headerIndexes)[foundIndex]}`);
  //         break;
  //       }
  //     }
      
  //     if (sampleRefIndex === -1) {
  //       sampleRefIndex = 0; // Default to first column if not found
  //       console.log("No sample reference column found, defaulting to first column");
  //     }

  //     // Parse data rows
  //     for (let i = 1; i < lines.length; i++) {
  //       const line = lines[i].trim();
  //       if (line) {
  //         const columns = line.split('\t');
          
  //         // Get the sample reference number with trimming to remove whitespace
  //         const sampleRef = columns[sampleRefIndex] ? columns[sampleRefIndex].trim() : '';
          
  //         // Skip header rows that might be repeated in the file
  //         if (sampleRef === 'Sample Reference Number' || !sampleRef) {
  //           continue;
  //         }
          
  //         console.log(`Line ${i}: Sample Ref = "${sampleRef}"`);
          
  //         // Get values using header indexes (with fallbacks)
  //         const drugIndex = headerIndexes['drugname'] || headerIndexes['drug'] || 1;
  //         const geneIndex = headerIndexes['genename'] || headerIndexes['gene'] || 2;
  //         const genoTypeIndex = headerIndexes['genotype'] || 3;
  //         const phenoTypeIndex = headerIndexes['phenotype'] || 4;
  //         const toxicityIndex = headerIndexes['drugresponsetoxicity'] || headerIndexes['toxicity'] || 5;
  //         const dosageIndex = headerIndexes['drugresponsedosage'] || headerIndexes['dosage'] || 6;
  //         const efficacyIndex = headerIndexes['drugresponseefficacy'] || headerIndexes['efficacy'] || 7;
  //         const evidenceIndex = headerIndexes['evidence'] || 8;
  //         const clinicalAnnotationIndex = headerIndexes['clinicalannotation'] || 9;
          
  //         labResultData.push({
  //           sampleReferenceNumber: sampleRef,
  //           drugName: columns[drugIndex] || '',
  //           geneName: columns[geneIndex] || '',
  //           genoType: columns[genoTypeIndex] || '',
  //           phenoType: columns[phenoTypeIndex] || '',
  //           drugResponseToxicity: columns[toxicityIndex] || '',
  //           drugResponseDosage: columns[dosageIndex] || '',
  //           drugResponseEfficacy: columns[efficacyIndex] || '',
  //           evidence: columns[evidenceIndex] || '',
  //           clinicalAnnotation: columns[clinicalAnnotationIndex] || ''
  //         });
  //       }
  //     }

  //     console.log("Processed lab result data:", labResultData);
      
  //     // Filter out invalid rows
  //     const validLabResults = labResultData.filter(item => 
  //       item.sampleReferenceNumber && 
  //       item.sampleReferenceNumber !== 'Sample Reference Number'
  //     );
      
  //     console.log("Valid lab results:", validLabResults);

  //     setBatchData(prev => ({
  //       ...prev,
  //       labResultFile: file,
  //       labResultData: validLabResults,
  //       validationErrors: []
  //     }));

  //     message.success(`Lab result file uploaded successfully. Found ${validLabResults.length} results.`);
  //   } catch (error) {
  //     console.error("Error parsing lab result file:", error);
  //     message.error('Failed to parse lab result file');
  //   }
  // };

 const handleLabResultFileUpload = async (file: File) => {
  try {
    const text = await file.text();
    const lines = text.split('\n');
    const labResultData: LabTestResult[] = [];

    // Skip empty lines
    const validLines = lines.filter(line => line.trim().length > 0);
    
    if (validLines.length < 3) {
      throw new Error("Invalid file format: File must contain header rows and data");
    }
    
    // First line contains gene names
    const geneNames = validLines[0].split('\t').map(name => name.trim()).filter(name => name);
    console.log("Gene names:", geneNames);
    
    // Second line contains column headers
    const columnHeaders = validLines[1].split('\t').map(header => header.trim());
    console.log("Column headers:", columnHeaders);
    
    // Find Sample Reference Number column index
    const sampleRefIndex = columnHeaders.findIndex(header => 
      header.toLowerCase().includes('sample reference number'));
    
    if (sampleRefIndex === -1) {
      throw new Error("Required column 'Sample Reference Number' not found");
    }

    // Function to normalize genotype and phenotype
    const normalizeGenotypeAndPhenotype = (rawGenotype: string, rawPhenotype: string) => {
      // Function mapping for genotype normalization
      const functionToGenotype: Record<string, string> = {
        'normal function': '*1/*1',
        'poor function': '*2/*2',
        'intermediate function': '*1/*2',
        'decreased function': '*1/*3',
        'increased function': '*1/*17',
        'ultrarapid function': '*1xN/*1',
        'no function': '*3/*3'
      };

      // Function mapping for phenotype normalization
      const functionToPhenotype: Record<string, string> = {
        'normal function': 'Normal metabolizer',
        'poor function': 'Poor metabolizer',
        'intermediate function': 'Intermediate metabolizer',
        'decreased function': 'Intermediate metabolizer',
        'increased function': 'Rapid metabolizer',
        'ultrarapid function': 'Ultrarapid metabolizer',
        'no function': 'Poor metabolizer'
      };

      // Metabolizer terms that should not be in genotype
      const metabolizerTerms = [
        'normal metabolizer', 'poor metabolizer', 'intermediate metabolizer',
        'rapid metabolizer', 'ultrarapid metabolizer', 'slow metabolizer'
      ];

      let normalizedGenotype = rawGenotype.trim();
      let normalizedPhenotype = rawPhenotype.trim();

      // Skip if genotype contains metabolizer terms - don't include these entries
      const lowerGenotype = normalizedGenotype.toLowerCase();
      if (metabolizerTerms.some(term => lowerGenotype.includes(term))) {
        console.warn(`Skipping entry with metabolizer in genotype: ${normalizedGenotype}`);
        return null; // Skip this entry completely
      }

      // Check if genotype contains function description
      const genoLower = normalizedGenotype.toLowerCase();
      if (functionToGenotype[genoLower]) {
        normalizedGenotype = functionToGenotype[genoLower];
        // If phenotype is empty or also contains function, normalize it
        if (!normalizedPhenotype || normalizedPhenotype.toLowerCase().includes('function')) {
          normalizedPhenotype = functionToPhenotype[genoLower];
        }
      }

      // Check if phenotype contains function description
      const phenoLower = normalizedPhenotype.toLowerCase();
      if (functionToPhenotype[phenoLower]) {
        normalizedPhenotype = functionToPhenotype[phenoLower];
        // If genotype is empty or also contains function, normalize it
        if (!normalizedGenotype || normalizedGenotype.toLowerCase().includes('function')) {
          normalizedGenotype = functionToGenotype[phenoLower];
        }
      }

      // Special handling for HLA genes (they typically have different patterns)
      if (normalizedGenotype.includes('Positive') || normalizedGenotype.includes('Negative')) {
        // For HLA, keep the original values
        normalizedGenotype = rawGenotype.trim();
        normalizedPhenotype = rawPhenotype.trim();
      }

      // Final validation: ensure we have valid genotype
      if (!normalizedGenotype || normalizedGenotype === '') {
        console.warn(`Skipping entry with empty genotype`);
        return null;
      }

      return {
        genotype: normalizedGenotype,
        phenotype: normalizedPhenotype
      };
    };
    
    // Process data rows (third row onwards)
    for (let i = 2; i < validLines.length; i++) {
      const line = validLines[i].trim();
      if (!line) continue;
      
      const columns = line.split('\t');
      
      // Get the sample reference number
      const sampleRef = columns[sampleRefIndex]?.trim() || '';
      if (!sampleRef || sampleRef === 'Sample Reference Number') continue;
      
      console.log(`Processing sample: ${sampleRef}`);
      
      // Create a new lab result entry
      const labResult: LabTestResult = {
        sampleReferenceNumber: sampleRef,
        drugName: '',
        geneName: '',
        genoType: '',
        phenoType: '',
        drugResponseToxicity: '',
        drugResponseDosage: '',
        drugResponseEfficacy: '',
        evidence: '',
        clinicalAnnotation: '',
        // Add PGX panel data as an array of gene objects
        pgxPanel: []
      };
      
      // Extract all genes and their data
      let currentIdx = 0;
      for (let j = 0; j < geneNames.length; j++) {
        const geneName = geneNames[j];
        if (!geneName) continue;
        
        // Skip the first column (Sample Reference Number)
        if (currentIdx === 0) {
          currentIdx = 1; // Start from column 1
        }
        
        // Find how many columns this gene has by looking at column headers
        let genotypeIdx = -1;
        let phenotypeIdx = -1;
        
        // Look for genotype and phenotype columns for this gene
        for (let k = currentIdx; k < columnHeaders.length; k++) {
          const header = columnHeaders[k].toLowerCase();
          
          // Skip activity score columns
          if (header.includes('activity score')) {
            continue;
          }
          
          // Find genotype column
          if (header.includes('genotype') && genotypeIdx === -1) {
            genotypeIdx = k;
          }
          // Find phenotype column (but not activity score)
          else if (header.includes('phenotype') && phenotypeIdx === -1) {
            phenotypeIdx = k;
          }
          
          // If we found both, break
          if (genotypeIdx !== -1 && phenotypeIdx !== -1) {
            break;
          }
          
          // Stop if we hit the next gene
          if (k > currentIdx && geneNames.some(g => g && columnHeaders[k].includes(g) && g !== geneName)) {
            break;
          }
        }
        
        // Process the found columns
        if (genotypeIdx !== -1 && phenotypeIdx !== -1 && 
            genotypeIdx < columns.length && phenotypeIdx < columns.length) {
          
          const rawGenotype = columns[genotypeIdx]?.trim() || '';
          const rawPhenotype = columns[phenotypeIdx]?.trim() || '';
          
          if (rawGenotype || rawPhenotype) {
            // Normalize genotype and phenotype
            const normalized = normalizeGenotypeAndPhenotype(rawGenotype, rawPhenotype);
            
            // Only add if normalization was successful (not null)
            if (normalized && normalized.genotype) {
              labResult.pgxPanel?.push({
                gene: geneName,
                genotype: normalized.genotype,
                phenotype: normalized.phenotype
              });

              console.log(`Gene ${geneName}: ${rawGenotype} → ${normalized.genotype}, ${rawPhenotype} → ${normalized.phenotype}`);
            } else {
              console.log(`Skipped Gene ${geneName}: Invalid or filtered data (${rawGenotype}, ${rawPhenotype})`);
            }
          }
        }
        
        // Move to next gene's columns
        // Find where the next gene starts
        let nextStartIdx = currentIdx + 1;
        for (let k = currentIdx + 1; k < columnHeaders.length; k++) {
          if (geneNames.some(g => g && columnHeaders[k] === 'Genotype' && k > currentIdx)) {
            nextStartIdx = k;
            break;
          }
        }
        currentIdx = nextStartIdx;
      }
      
      labResultData.push(labResult);
    }

    console.log("Processed lab result data with PGX panel:", labResultData);
    
    setBatchData(prev => ({
      ...prev,
      labResultFile: file,
      labResultData: labResultData,
      validationErrors: []
    }));

    message.success(`Lab result file uploaded successfully. Found ${labResultData.length} results.`);
  } catch (error) {
    console.error("Error parsing lab result file:", error);
    message.error(`Failed to parse lab result file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
  // Validate and Match Data
  const validateAndMatchData = () => {
    const { patientData, labResultData } = batchData;
    const errors: string[] = [];
    const matchedData: any[] = [];

    // Check if both files are uploaded
    if (patientData.length === 0) {
      errors.push('Meta Data list file is required');
    }
    if (labResultData.length === 0) {
      errors.push('Lab test results file is required');
    }

    if (errors.length === 0) {
      console.log("Validating data match between:");
      console.log("Patient data:", patientData.map(p => p.sampleReferenceNumber));
      console.log("Lab results:", labResultData.map(l => l.sampleReferenceNumber));
      
      // First pass: Collect all unique sample reference numbers from both datasets
      const allSampleRefs = new Set([
        ...patientData.map(p => p.sampleReferenceNumber),
        ...labResultData.map(l => l.sampleReferenceNumber)
      ]);
      
      console.log("All unique sample refs:", [...allSampleRefs]);
      
      // For each patient, find matching lab results
     for (const patient of patientData) {
      // Pastikan string
      const patientRef = (patient.sampleReferenceNumber ?? '').toString().trim();

      const labResults = labResultData.filter(
        result => ((result.sampleReferenceNumber ?? '').toString().trim() === patientRef)
      );

      if (labResults.length === 0) {
        errors.push(`No lab results found for Sample Reference Number: ${patientRef}`);
      } else {
        matchedData.push({
          patient,
          labResults
        });
      }
    }

      // Check for lab results without matching patients
      for (const labResult of labResultData) {
        const labRef = (labResult.sampleReferenceNumber ?? '').toString().trim();
        const hasMatchingPatient = patientData.some(
          patient => ((patient.sampleReferenceNumber ?? '').toString().trim() === labRef)
        );
        if (!hasMatchingPatient) {
          errors.push(`No patient found for Sample Reference Number: ${labRef}`);
        }
      }
    }

    console.log("Validation complete. Errors:", errors);
    console.log("Matched data:", matchedData);

    setBatchData(prev => ({
      ...prev,
      matchedData,
      validationErrors: errors
    }));

    return errors.length === 0;
  };

    const convertExcelDate = (excelDate: string | number): string => {
          if (!excelDate) return '';
          
          // If it's already a date string in a recognizable format, return it
          if (typeof excelDate === 'string' && (excelDate.includes('-') || excelDate.includes('/'))) {
            // Try to parse and standardize
            const date = new Date(excelDate);
            if (!isNaN(date.getTime())) {
              return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
            }
          }
          
          // Convert Excel date number to JS date
          try {
            const dateNum = typeof excelDate === 'string' ? parseInt(excelDate) : excelDate;
            if (isNaN(dateNum)) return '';
            
            // Excel dates start from December 30, 1899
            const date = new Date((dateNum - 25569) * 86400 * 1000);
            return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          } catch (e) {
            console.error("Error converting date:", e);
            return '';
          }
        };
  // Process a single record
  const processSingleRecord = async (patient: PatientData, labResults: LabTestResult[]) => {
  try {
    // Map lab results to the format expected by generateReportBlob
    const testResults = labResults.map(result => ({
      clinicalannotation: result.clinicalAnnotation || "",
      drug: result.drugName || "",
      gene: result.geneName ? result.geneName.split(",") : [],
      genotype: result.genoType ? result.genoType.split(",") : [],
      phenotype: result.phenoType ? result.phenoType.split(",") : [],
      toxicity: result.drugResponseToxicity ? result.drugResponseToxicity.split(",") : [],
      dosage: result.drugResponseDosage ? result.drugResponseDosage.split(",") : [],
      efficacy: result.drugResponseEfficacy ? result.drugResponseEfficacy.split(",") : [],
      evidence: result.evidence ? result.evidence.split(",") : [],
    }));
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error("Authentication token not found. Please login again.");
    }
    const pgxPanel = labResults[0]?.pgxPanel || [];
    
    // Better patient name handling: combine first and last name properly
    let patientName = patient.patientName || '';
    if (!patientName && patient.patientLastName) {
      patientName = patient.patientLastName;
    }
    if (!patientName) {
      patientName = `Unknown (${patient.sampleReferenceNumber})`;
    }
    
    // Pastikan sex tidak kosong - default ke 'Male'
    const sex = patient.sex || "Male";

    // Add additional genes from individual lab results if they have geneName/genoType/phenoType
    labResults.forEach(result => {
      if (result.geneName && result.genoType) {
        // Check if this gene is already in pgxPanel
        const exists = pgxPanel.some(p => p.gene === result.geneName);
        if (!exists) {
          pgxPanel.push({
            gene: result.geneName,
            genotype: result.genoType,
            phenotype: result.phenoType
          });
        }
      }
    });

     // Convert dates properly
    const dateOfBirth = convertExcelDate(patient.dateOfBirth || '');
    const sampleCollectionDate = convertExcelDate(patient.sampleCollectionDate || '');
    const sampleReceivedDate = convertExcelDate(patient.sampleReceivedDate || '');
    const currentDate = dayjs().format("YYYY-MM-DD");
    
    // Remove duplicates
    const uniqueTestResults = testResults.filter((row, index, self) => {
      return (
        index === self.findIndex(
          (r) =>
            r.drug === row.drug &&
            JSON.stringify(r.gene) === JSON.stringify(row.gene) &&
            JSON.stringify(r.genotype) === JSON.stringify(row.genotype)
        )
      );
    });

    // Format data for report
   // Format data for report
    // const reportData = {
    //   patient: {
    //     "Patient Name": patientName,
    //     "Date of Birth": dateOfBirth || currentDate,
    //     Sex: sex,
    //     MRN: patient.mrn || `MRN-${patient.sampleReferenceNumber}`,
    //     Ethnicity: patient.ethnicity || "N/A",
    //   },
      
    //   specimen: {
    //     "Specimen Type": patient.specimenType || "Whole Blood",
    //     "Specimen ID": `SP-${patient.sampleReferenceNumber}`,
    //     "Specimen Collected": "TTSH Hospital",
    //     "Specimen Received": dayjs().format("YYYY-MM-DD"),
    //   },
    //   orderedBy: {
    //     Requester: "TTSH Hospital",
    //     Physician: patient.physicianName || "Unknown Physician",
    //   },
    //   caseInfo: {
    //     "Test Case ID": patient.sampleReferenceNumber,
    //     "Review Status": "Final",
    //     "Date Accessioned": dayjs().format("YYYY-MM-DD"),
    //     "Date Reported": dayjs().format("YYYY-MM-DD"),
    //   },
    //   test_information: "Pharmacogenomics Test",
    //   lab_result_summary: "Batch uploaded lab test results",
    //   testResults: uniqueTestResults,
    // };

      const reportData = {
      // Standard fields expected by PDF generator
      labAccessionNo: patient.sampleReferenceNumber || '',
      name: patientName,
      nric: patient.idNumber || '',
      dob: dateOfBirth || '',
      requestedBy: patient.physicianName || 'Unknown Physician',
      comments: patient.clinicalNotes || '',
      
      location: patient.requester || 'TTSH',
      race: patient.ethnicity || '',
      sex: sex,
      age: patient.patientAgeGroup || '',
      dateReceived: sampleReceivedDate || dayjs().format("YYYY-MM-DD"),
      dateReport: dayjs().format("YYYY-MM-DD"),
      
      // Additional fields from batch upload
      patientIdType: patient.patientIdType || '',
      patientContactNumber: patient.patientContactNumber || '',
      patientAddress: patient.patientAddress || '',
      patientPopulation: patient.patientPopulation || '',
      patientBodyWeight: patient.patientBodyWeight || '',
      sampleDescription: patient.sampleDescription || '',
      
      // PGX panel data
      pgxPanel: pgxPanel,
    };

    // Generate PDF blob
    const pdfBlob = await generateReportBlob(reportData);

    // Generate HL7 message
    const hl7Message = buildHL7Message({
      patient_name: patientName,
      date_of_birth: patient.dateOfBirth || dayjs().format("YYYY-MM-DD"),
      sex: sex, // Gunakan nilai sex yang sudah dipastikan
      mrn: patient.mrn || `MRN-${patient.sampleReferenceNumber}`,
      test_case_id: patient.sampleReferenceNumber,
      specimen_type: patient.specimenType || "Whole Blood",
      specimen_id: `SP-${patient.sampleReferenceNumber}`,
      specimen_collected_from: "TTSH Hospital",
      specimen_received: dayjs().format("YYYY-MM-DD"),
      test_information: "Pharmacogenomics Test",
      lab_result_summary: "Batch uploaded lab test results",
      testResults: uniqueTestResults,
    });

      

    // Create HL7 blob
    const hl7Blob = new Blob([hl7Message], { type: "text/plain" });

    // Create FormData object
    const formData = new FormData();
    
    // Add files
    const sanitizedPatientName = patientName.replace(/\s+/g, "_");
    formData.append("report_download_pdf", pdfBlob, `${sanitizedPatientName}_Report.pdf`);
    formData.append("report_download_hl7", hl7Blob, `${sanitizedPatientName}_Report.hl7`);
  
    // Basic patient information
     formData.append("patient_name", patientName);
    formData.append("patient_last_name", patient.patientLastName || "");
    formData.append("date_of_birth", dateOfBirth || currentDate);
    formData.append("sex", sex);
    formData.append("mrn", patient.mrn || `MRN-${patient.sampleReferenceNumber}`);
    formData.append("ethnicity", patient.ethnicity || "N/A");
    
    // Additional patient details
    formData.append("patient_age_group", patient.patientAgeGroup || "");
    formData.append("patient_super_population", patient.patientSuperPopulation || "");
    formData.append("patient_population", patient.patientPopulation || "");
    formData.append("is_patient_hispanic", patient.isPatientHispanic ? "true" : "false");
    formData.append("patient_body_weight", patient.patientBodyWeight ? patient.patientBodyWeight.toString() : "");
    formData.append("treatment_history_carbamazepine", patient.treatmentHistoryCarbamazepine || "");
    formData.append("patient_id_type", patient.patientIdType || "");
    formData.append("id_number", patient.idNumber || "");
    formData.append("patient_contact_number", patient.patientContactNumber || "");
    formData.append("patient_address", patient.patientAddress || "");

    // Test and request information
    formData.append("test_request_reference_number", patient.testRequestReferenceNumber || "");
    formData.append("requester", patient.requester || "");
    formData.append("requester_address", patient.requesterAddress || "");
    formData.append("test_comment", patient.testComment || "");
    formData.append("panel_id", patient.panelId || "");
    formData.append("drug_group_id", patient.drugGroupId || "");
    formData.append("clinical_notes", patient.clinicalNotes || "");

    // Sample information
    formData.append("sample_reference_number", patient.sampleReferenceNumber2 || patient.sampleReferenceNumber || "");
    formData.append("sample_collection_date", sampleCollectionDate || "");
    formData.append("sample_received_date", sampleReceivedDate || "");
    formData.append("sample_description", patient.sampleDescription || "");
    formData.append("platform", patient.platform || "");
    formData.append("data_type", patient.dataType || "");
    formData.append("sample_file", patient.sampleFile || "");

    // Existing required fields
    formData.append("specimen_collected_from", "TTSH Hospital");
    formData.append("specimen_type", patient.specimenType || "Whole Blood");
    formData.append("specimen_id", `SP-${patient.sampleReferenceNumber}`);
    formData.append("specimen_received", dayjs().format("YYYY-MM-DD"));
    formData.append("test_information", "Pharmacogenomics Test");
    formData.append("lab_result_summary", "Batch uploaded lab test results");
    formData.append("physician_name", patient.physicianName || "Unknown Physician");
    formData.append("reviewer_name", "System Generated");
    formData.append("test_case_id", patient.sampleReferenceNumber);
    formData.append("disease", patient.disease || "Not specified");

   // Debug info - log what we're actually sending
    console.log("Sending patient data:", {
      // Log entire patient object for debugging
      patientName,
      dateOfBirth,
      sampleCollectionDate,
      sampleReceivedDate,
      sampleReferenceNumber: patient.sampleReferenceNumber,
      // Add these to see if they contain data
      testRequestReferenceNumber: patient.testRequestReferenceNumber,
      panelId: patient.panelId,
      drugGroupId: patient.drugGroupId,
      idNumber: patient.idNumber,
      requester: patient.requester,
      // Add more fields as needed
    });

    // Send to API
    const response = await fetch(`${API_URL}/lab-tests`, {
      method: "POST",
      body: formData,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // Tambahkan logging detail response untuk debug
      const errorText = await response.text();
      console.error(`Server responded with ${response.status}: ${errorText}`);
      throw new Error(`Failed to upload record for ${patientName}: ${response.statusText}`);
    }

    // Parse response untuk memastikan data disimpan dengan benar
    const responseData = await response.json();
    console.log("API Response:", responseData);

    return responseData; // Return data yang berhasil disimpan
  } catch (error) {
    console.error(`Error processing record for ${patient.patientName || 'unknown patient'}:`, error);
    throw error;
  }
};

  // Process Batch Upload
  const processBatchUpload = async () => {
    if (!validateAndMatchData()) {
      message.error('Please fix validation errors before uploading');
      return;
    }

    setConfirmModalVisible(false);
    setBatchData(prev => ({ 
      ...prev, 
      uploadStatus: 'processing', 
      progress: 0,
      currentProcessingItem: ''
    }));

    try {
      const { matchedData } = batchData;
      const totalItems = matchedData.length;
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < matchedData.length; i++) {
        const { patient, labResults } = matchedData[i];
        
        // Update progress and current item
        const progress = Math.round(((i) / totalItems) * 100);
        setBatchData(prev => ({ 
          ...prev, 
          progress, 
          currentProcessingItem: patient.patientName 
        }));

        try {
          // Process this record
          await processSingleRecord(patient, labResults);
          successCount++;
          
          // Update progress
          const newProgress = Math.round(((i + 1) / totalItems) * 100);
          setBatchData(prev => ({ 
            ...prev, 
            progress: newProgress
          }));
        } catch (error) {
          failCount++;
          console.error(`Failed to process ${patient.patientName}:`, error);
        }

        // Small delay to avoid overwhelming server
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Final update
      setBatchData(prev => ({ 
        ...prev, 
        uploadStatus: 'success', 
        progress: 100,
        currentProcessingItem: ''
      }));

      // Show success message
      message.success(`Successfully uploaded ${successCount} lab test records! ${failCount > 0 ? `(${failCount} failed)` : ''}`);
      
      // Show success modal
      setSuccessModalVisible(true);

    } catch (error: any) {
      setBatchData(prev => ({ 
        ...prev, 
        uploadStatus: 'error', 
        progress: 0,
        currentProcessingItem: ''
      }));
      message.error(`Batch upload failed: ${error.message}`);
      console.error("Batch upload error:", error);
    }
  };

  const columns = [
    {
      title: 'Sample Reference Number',
      dataIndex: ['patient', 'sampleReferenceNumber'],
      key: 'sampleReferenceNumber',
    },
    {
      title: 'Patient Name',
      dataIndex: ['patient', 'patientName'],
      key: 'patientName',
    },
    {
      title: 'Patient Info',
      key: 'patientInfo',
      render: (_: unknown, record: any) => (
        <div>
          <div><strong>Name:</strong> {record.patient.patientName}</div>
          <div><strong>Sex:</strong> {record.patient.sex || 'N/A'}</div>
          <div><strong>DOB:</strong> {record.patient.dateOfBirth || 'N/A'}</div>
          <div><strong>MRN:</strong> {record.patient.mrn || 'N/A'}</div>
          <div><strong>Sample Ref:</strong> {record.patient.sampleReferenceNumber}</div>
        </div>
      ),
    },
    {
      title: 'Lab Results',
      key: 'labResults',
      render: (_: unknown, record: any) => (
        <div>
          <div>Count: {record.labResults.length}</div>
          <div>
            {record.labResults.slice(0, 2).map((result: any, index: number) => (
              <div key={index} style={{ fontSize: '12px', color: '#666' }}>
                {result.drugName || 'N/A'} / {result.geneName || 'N/A'}
              </div>
            ))}
            {record.labResults.length > 2 && (
              <div style={{ fontSize: '12px', color: '#666' }}>...</div>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      render: () => <span style={{ color: 'green' }}>✓ Matched</span>,
      key: 'status',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="Batch Upload Lab Tests" style={{ marginBottom: '24px' }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Alert
            message="Upload Requirements"
            description="Please upload exactly 2 files: 1 Patient List file (.csv/.xlsx) and 1 Lab Test Results file (.txt)"
            type="info"
            showIcon
          />

          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
            {/* Patient List File Upload */}
            <Card size="small" style={{ flex: 1 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileExcelOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                  <strong>Meta Data List File</strong>
                </div>
                <Upload
                  accept=".csv,.xlsx,.xls"
                  beforeUpload={(file) => {
                    handlePatientFileUpload(file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    {batchData.patientFile ? 'Change File' : 'Select Patient File'}
                  </Button>
                </Upload>
                {batchData.patientFile && (
                  <div style={{ color: '#52c41a' }}>
                    ✓ {batchData.patientFile.name} ({batchData.patientData.length} patients)
                  </div>
                )}
              </Space>
            </Card>

            {/* Lab Results File Upload */}
            <Card size="small" style={{ flex: 1 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileTextOutlined style={{ fontSize: '20px', color: '#1890ff' }} />
                  <strong>Lab Test Results File</strong>
                </div>
                <Upload
                  accept=".txt"
                  beforeUpload={(file) => {
                    handleLabResultFileUpload(file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>
                    {batchData.labResultFile ? 'Change File' : 'Select Results File'}
                  </Button>
                </Upload>
                {batchData.labResultFile && (
                  <div style={{ color: '#1890ff' }}>
                    ✓ {batchData.labResultFile.name} ({batchData.labResultData.length} results)
                  </div>
                )}
              </Space>
            </Card>
          </div>
          
          {/* SUBMIT BUTTON */}
          <Button
            type="primary"
            size="large"
            icon={<CloudUploadOutlined />}
            onClick={() => {
              if (validateAndMatchData()) {
                setConfirmModalVisible(true);
              }
            }}
            loading={batchData.uploadStatus === 'processing'}
            disabled={!batchData.patientFile || !batchData.labResultFile}
            style={{ 
              width: '100%', 
              height: '50px', 
              fontSize: '16px',
              marginTop: '10px',
              backgroundColor: '#1890ff', 
              borderColor: '#1890ff' 
            }}
          >
            PROCESS BATCH UPLOAD
          </Button>
        </Space>
      </Card>

      {/* Validation Errors */}
      {batchData.validationErrors.length > 0 && (
        <Card title="Validation Errors" style={{ marginBottom: '24px' }}>
          <Alert
            message="Please fix the following errors:"
            description={
              <ul>
                {batchData.validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            }
            type="error"
            showIcon
          />
        </Card>
      )}

      {/* Matched Data Preview */}
      {batchData.matchedData.length > 0 && (
        <Card 
          title={`Matched Data Preview (${batchData.matchedData.length} records)`}
          extra={
            <Button
              type="primary"
              icon={<CloudUploadOutlined />}
              onClick={processBatchUpload}
              loading={batchData.uploadStatus === 'processing'}
              disabled={batchData.validationErrors.length > 0}
            >
              Start Batch Upload
            </Button>
          }
        >
          {batchData.uploadStatus === 'processing' && (
            <div style={{ marginBottom: '16px' }}>
              <Progress percent={batchData.progress} status="active" />
              <p>
                Uploading records... {batchData.progress}%
                {batchData.currentProcessingItem && (
                  <span> (Processing: {batchData.currentProcessingItem})</span>
                )}
              </p>
            </div>
          )}
          
          {batchData.uploadStatus === 'success' && (
            <Alert 
              message="Upload Complete" 
              description="All records have been successfully processed. Redirecting to lab tests page..."
              type="success"
              showIcon
              style={{ marginBottom: '16px' }}
            />
          )}
          
          <Table
            columns={columns}
            dataSource={batchData.matchedData}
            rowKey={(record) => record.patient.sampleReferenceNumber}
            pagination={{ pageSize: 10 }}
            size="small"
          />
        </Card>
      )}

      {/* Confirmation Modal */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center' }}><CloudUploadOutlined style={{ marginRight: '8px', color: '#1890ff' }} /> Confirm Batch Upload</div>}
        open={confirmModalVisible}
        onOk={processBatchUpload}
        onCancel={() => setConfirmModalVisible(false)}
        okText="Start Processing"
        cancelText="Cancel"
        okButtonProps={{ 
          style: { backgroundColor: '#52c41a', borderColor: '#52c41a' }
        }}
      >
        <Alert
          message="You are about to upload multiple records"
          description={
            <div>
              <p>You are about to process and upload <strong>{batchData.matchedData.length} lab test records</strong>.</p>
              <p>This will generate PDF and HL7 files for each record and store them in the database.</p>
              <p>Do you want to continue?</p>
            </div>
          }
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />
      </Modal>

      {/* Success Modal */}
      <Modal
        title={<div style={{ display: 'flex', alignItems: 'center' }}><CheckCircleOutlined style={{ marginRight: '8px', color: '#52c41a' }} /> Upload Successful</div>}
        open={successModalVisible}
        footer={[
          <Button 
            key="ok" 
            type="primary"
            onClick={() => {
              setSuccessModalVisible(false);
              navigate('/lab-tests');
            }}
          >
            Go to Lab Tests
          </Button>
        ]}
        closable={false}
      >
        <Alert
          message="Batch upload completed successfully"
          description={
            <div>
              <p>All <strong>{batchData.matchedData.length} lab test records</strong> have been successfully uploaded.</p>
              <p>You will be redirected to the Lab Tests page when you click the button below.</p>
            </div>
          }
          type="success"
          showIcon
        />
        <Progress percent={100} status="success" />
      </Modal>
    </div>
  );
};

export default BatchUpload;