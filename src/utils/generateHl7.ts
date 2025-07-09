interface HL7MappingRule {
  gene: string;
  genotype: string;
  phenotype: string;
  varconceptCode: string;
  hl7Value: string;
  valueType: string;
  subId: string;
  observationIdentifier: string;
}

// Complete mapping rules based on your Excel file
const HL7_MAPPING_RULES: HL7MappingRule[] = [
  // ABCG2 mappings
  // 421C/C - Normal function
  {
    gene: "ABCG2",
    genotype: "421C/C",
    phenotype: "Normal function",
    varconceptCode: "VARCONCEPT514",
    hl7Value: "74^ABCG2^HGNC",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Gene Studied",
  },
  {
    gene: "ABCG2",
    genotype: "421C/C",
    phenotype: "Normal function",
    varconceptCode: "VARCONCEPT506",
    hl7Value: "421C/C",
    valueType: "ST",
    subId: "4a",
    observationIdentifier: "Genotype Name",
  },
  {
    gene: "ABCG2",
    genotype: "421C/C",
    phenotype: "Normal function",
    varconceptCode: "VARCONCEPT553",
    hl7Value: "^Drug response",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Variant Classification",
  },
  {
    gene: "ABCG2",
    genotype: "421C/C",
    phenotype: "Normal function",
    varconceptCode: "VARCONCEPT569",
    hl7Value: "^Transport",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Pharmacogenomic Effect Type",
  },
  {
    gene: "ABCG2",
    genotype: "421C/C",
    phenotype: "Normal function",
    varconceptCode: "VARCONCEPT570",
    hl7Value: "^Normal function",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Pharmacogenomic Effect Value",
  },

  // 421A/A - Poor function
  {
    gene: "ABCG2",
    genotype: "421A/A",
    phenotype: "Poor function",
    varconceptCode: "VARCONCEPT514",
    hl7Value: "74^ABCG2^HGNC",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Gene Studied",
  },
  {
    gene: "ABCG2",
    genotype: "421A/A",
    phenotype: "Poor function",
    varconceptCode: "VARCONCEPT506",
    hl7Value: "421A/A",
    valueType: "ST",
    subId: "4a",
    observationIdentifier: "Genotype Name",
  },
  {
    gene: "ABCG2",
    genotype: "421A/A",
    phenotype: "Poor function",
    varconceptCode: "VARCONCEPT553",
    hl7Value: "^Drug response",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Variant Classification",
  },
  {
    gene: "ABCG2",
    genotype: "421A/A",
    phenotype: "Poor function",
    varconceptCode: "VARCONCEPT569",
    hl7Value: "^Transport",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Pharmacogenomic Effect Type",
  },
  {
    gene: "ABCG2",
    genotype: "421A/A",
    phenotype: "Poor function",
    varconceptCode: "VARCONCEPT570",
    hl7Value: "^Poor function",
    valueType: "CWE",
    subId: "4a",
    observationIdentifier: "Pharmacogenomic Effect Value",
  },

  // CYP2C19 mappings
  // *2/*2 - Poor metabolizer
  {
    gene: "CYP2C19",
    genotype: "*2/*2",
    phenotype: "Poor metabolizer",
    varconceptCode: "VARCONCEPT514",
    hl7Value: "2621^CYP2C19^HGNC",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Gene Studied",
  },
  {
    gene: "CYP2C19",
    genotype: "*2/*2",
    phenotype: "Poor metabolizer",
    varconceptCode: "VARCONCEPT506",
    hl7Value: "*2/*2",
    valueType: "ST",
    subId: "4b",
    observationIdentifier: "Genotype Name",
  },
  {
    gene: "CYP2C19",
    genotype: "*2/*2",
    phenotype: "Poor metabolizer",
    varconceptCode: "VARCONCEPT553",
    hl7Value: "^Drug response",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Variant Classification",
  },
  {
    gene: "CYP2C19",
    genotype: "*2/*2",
    phenotype: "Poor metabolizer",
    varconceptCode: "VARCONCEPT569",
    hl7Value: "^Metabolism",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Pharmacogenomic Effect Type",
  },
  {
    gene: "CYP2C19",
    genotype: "*2/*2",
    phenotype: "Poor metabolizer",
    varconceptCode: "VARCONCEPT570",
    hl7Value: "^Poor metabolizer",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Pharmacogenomic Effect Value",
  },

  // *1/*1 - Normal metabolizer
  {
    gene: "CYP2C19",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT514",
    hl7Value: "2621^CYP2C19^HGNC",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Gene Studied",
  },
  {
    gene: "CYP2C19",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT506",
    hl7Value: "*1/*1",
    valueType: "ST",
    subId: "4b",
    observationIdentifier: "Genotype Name",
  },
  {
    gene: "CYP2C19",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT553",
    hl7Value: "^Drug response",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Variant Classification",
  },
  {
    gene: "CYP2C19",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT569",
    hl7Value: "^Metabolism",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Pharmacogenomic Effect Type",
  },
  {
    gene: "CYP2C19",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT570",
    hl7Value: "^Normal metabolizer",
    valueType: "CWE",
    subId: "4b",
    observationIdentifier: "Pharmacogenomic Effect Value",
  },

  // CYP2C9 mappings
  {
    gene: "CYP2C9",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT514",
    hl7Value: "1559^CYP2C9^HGNC",
    valueType: "CWE",
    subId: "4c",
    observationIdentifier: "Gene Studied",
  },
  {
    gene: "CYP2C9",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT506",
    hl7Value: "*1/*1",
    valueType: "ST",
    subId: "4c",
    observationIdentifier: "Genotype Name",
  },
  {
    gene: "CYP2C9",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT570",
    hl7Value: "^Normal metabolizer",
    valueType: "CWE",
    subId: "4c",
    observationIdentifier: "Pharmacogenomic Effect Value",
  },

  // CYP2D6 mappings
  {
    gene: "CYP2D6",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT514",
    hl7Value: "1565^CYP2D6^HGNC",
    valueType: "CWE",
    subId: "4d",
    observationIdentifier: "Gene Studied",
  },
  {
    gene: "CYP2D6",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT506",
    hl7Value: "*1/*1",
    valueType: "ST",
    subId: "4d",
    observationIdentifier: "Genotype Name",
  },
  {
    gene: "CYP2D6",
    genotype: "*1/*1",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT570",
    hl7Value: "^Normal metabolizer",
    valueType: "CWE",
    subId: "4d",
    observationIdentifier: "Pharmacogenomic Effect Value",
  },

  {
    gene: "CYP2D6",
    genotype: "*1/*36-*10",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT514",
    hl7Value: "1565^CYP2D6^HGNC",
    valueType: "CWE",
    subId: "4d",
    observationIdentifier: "Gene Studied",
  },
  {
    gene: "CYP2D6",
    genotype: "*1/*36-*10",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT506",
    hl7Value: "*1/*36-*10",
    valueType: "ST",
    subId: "4d",
    observationIdentifier: "Genotype Name",
  },
  {
    gene: "CYP2D6",
    genotype: "*1/*36-*10",
    phenotype: "Normal metabolizer",
    varconceptCode: "VARCONCEPT570",
    hl7Value: "^Normal metabolizer",
    valueType: "CWE",
    subId: "4d",
    observationIdentifier: "Pharmacogenomic Effect Value",
  },

  // Add mappings for all other genes: CYP3A5, CYP4F2, DPYD, HLA genes, NUDT15, SLCO1B1, TPMT, UGT1A1, VKORC1
  // You would need to add all combinations from your test data

  // ... continue adding all other gene mappings
];

// Updated function to get mapping rules
function getMappingRulesForGene(
  gene: string,
  genotype: string
): HL7MappingRule[] {
  console.log(
    `Looking for mapping rules for gene: ${gene}, genotype: ${genotype}`
  );

  const rules = HL7_MAPPING_RULES.filter((rule) => {
    const geneMatch = rule.gene.toUpperCase() === gene.toUpperCase();
    const genotypeMatch = rule.genotype === genotype;
    return geneMatch && genotypeMatch;
  });

  console.log(`Found ${rules.length} mapping rules for ${gene} ${genotype}`);
  return rules;
}

export function buildHL7Message(data: any): string {
  console.log("Data received in buildHL7Message:", data);

  const currentDateTime = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);
  const messageControlId = `LAB${Math.floor(Math.random() * 100000)}`; // Changed from TTSH

  // MSH Segment - EPIC Compatible (Fixed structure)
  const mshSegment = [
    "MSH",
    "^~\\&",
    "LIS",
    "LIS", // Changed from "TTSHLIS"
    "EMR",
    "EMR", // Changed from "TTSHCLOVER"
    currentDateTime,
    "",
    "ORU^R01",
    messageControlId,
    "P",
    "2.3",
    "",
    "",
    "AL",
    "NE",
  ].join("|");

  // PID Segment - EPIC Compatible
  const patientNameParts = (data.patient_name || "").split(" ");
  const lastName = patientNameParts[patientNameParts.length - 1] || "";
  const firstName = patientNameParts.slice(0, -1).join(" ") || "";

  const pidSegment = [
    "PID",
    "",
    "",
    data.id_number || data.mrn || "",
    "",
    `${lastName}^${firstName}`,
    "",
    data.date_of_birth ? data.date_of_birth.replace(/-/g, "") : "",
    data.sex || "U",
    "",
    "C^Chinese",
    data.patient_address || "Hospital Address", // Changed from TTSH address
    "",
    data.patient_contact_number || "Contact Number",
    "",
    "",
    "",
    "",
    data.test_case_id || "",
  ].join("|");

  // PV1 Segment - Patient Visit
  const pv1Segment = [
    "PV1",
    "",
    "I",
    "HOSPITAL^NONE^^^HOSPITAL", // Changed from TTSH DDR-ANGIO
    "",
    "",
    "",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "",
    "HOSPITAL", // Changed from TSGMD
    "",
    "",
    "",
    "",
    "",
    "",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "NA",
    (data.test_case_id || "UNKNOWN") +
      "^^^^I~" +
      (data.test_case_id || "UNKNOWN") +
      "^^^^O",
    "SELF^19991130000000",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    currentDateTime.slice(0, 12) + "59",
  ].join("|");

  // ORC Segment - Order Control
  const labAccessionNo = String(data.test_case_id || `${currentDateTime}001`);

  const orcSegment = [
    "ORC",
    "NW",
    "",
    labAccessionNo + "^LAB",
    "",
    "A",
    "",
    "^^^" + currentDateTime.slice(0, 12) + "00^^R",
    "",
    "",
    "",
    "",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "HOSPITAL^^^^HOSPITAL^^^^HOSPITAL", // Changed from TTSH DDR-ANGIO
  ].join("|");

  // OBR Segment - Observation Request
  const obrSegment = [
    "OBR",
    "1",
    "",
    labAccessionNo + "^LABDNL", // Changed from TTSHTDNL
    "PGXP^PGX Targeted Panel",
    "",
    "",
    currentDateTime.slice(0, 12) + "29",
    "",
    "",
    "",
    "",
    "",
    "",
    currentDateTime.slice(0, 12) + "29",
    data.specimen_type || "EDTA",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "",
    labAccessionNo.length >= 10 ? labAccessionNo.slice(-10) : labAccessionNo,
    "",
    labAccessionNo.length >= 10 ? labAccessionNo.slice(-10) : labAccessionNo,
    labAccessionNo + "-" + messageControlId,
    currentDateTime,
    "",
    "GL^24^52^036",
    "C",
    "",
    "^^^^^R",
  ].join("|");

  console.log("Test Results:", data.testResults);
  console.log("PGX Panel:", data.pgxPanel);

  // OBX Segments - Generate using mapping rules from Excel
  let obxSegments: string[] = [];
  let obxSetId = 1;

  if (data.pgxPanel && data.pgxPanel.length > 0) {
    // Process each gene in the PGX panel
    data.pgxPanel.forEach((geneData: any) => {
      const gene = geneData.gene || "";
      const genotype = geneData.genotype || "";
      const phenotype = geneData.phenotype || "";

      console.log(
        `Processing gene: ${gene}, genotype: ${genotype}, phenotype: ${phenotype}`
      );

      // Get mapping rules for this gene and genotype
      const mappingRules = getMappingRulesForGene(gene, genotype);

      if (mappingRules.length > 0) {
        // Generate OBX segments based on mapping rules
        mappingRules.forEach((rule) => {
          const obxSegment = [
            "OBX", // OBX-0: segment ID
            obxSetId, // OBX-1: set ID
            rule.valueType, // OBX-2: value type (ST, CWE, etc.)
            `${rule.varconceptCode}^${rule.observationIdentifier}^EPIC`, // OBX-3: observation identifier
            rule.subId, // OBX-4: observation sub-ID
            rule.hl7Value, // OBX-5: observation value
            "", // OBX-6: units
            "", // OBX-7: references range
            "", // OBX-8: abnormal flags
            "", // OBX-9: probability
            "", // OBX-10: nature of abnormal test
            "", // OBX-11: observation result status (REMOVED "F")
            "", // OBX-12: effective date of reference range
            "", // OBX-13: user defined access checks
            "", // OBX-14: date/time of the observation (REMOVED currentDateTime)
            "", // OBX-15: producer's ID
            "", // OBX-16: responsible observer
          ].join("|");

          obxSegments.push(obxSegment);
          obxSetId++;
        });
      } else {
        // Fallback: create a simple OBX segment if no mapping rules found
        console.warn(
          `No mapping rules found for gene: ${gene}, genotype: ${genotype}`
        );

        const obxSegment = [
          "OBX",
          obxSetId,
          "ST",
          `${gene}^Genotype^LN`,
          "",
          genotype,
          "",
          "",
          "",
          "",
          "",
          "", // REMOVED "F"
          "",
          "",
          "", // REMOVED currentDateTime
          "",
          phenotype,
        ].join("|");

        obxSegments.push(obxSegment);
        obxSetId++;
      }
    });
  } else if (data.testResults && data.testResults.length > 0) {
    // Fallback to old testResults structure
    obxSegments = data.testResults.map((result: any, index: number) => {
      const gene = Array.isArray(result.gene)
        ? result.gene.join(", ")
        : result.gene || "";
      const genotype = Array.isArray(result.genotype)
        ? result.genotype.join(", ")
        : result.genotype || "";
      const phenotype = result.phenotype || "N/A";

      return [
        "OBX",
        index + 1,
        "ST",
        `${gene}^Genotype^LN`,
        "",
        genotype,
        "",
        "",
        "",
        "",
        "",
        "", // REMOVED "F"
        "",
        "",
        "", // REMOVED currentDateTime
        "",
        phenotype,
      ].join("|");
    });
  }

  console.log("Generated OBX Segments:", obxSegments);

  // Combine all segments with proper HL7 line separators
  return [
    mshSegment,
    pidSegment,
    pv1Segment,
    orcSegment,
    obrSegment,
    ...obxSegments,
  ].join("\r\n");
}
