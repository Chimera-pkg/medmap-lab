export function buildHL7Message(data: any): string {
  console.log("Data received in buildHL7Message:", data);

  const currentDateTime = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);
  const messageControlId = `TTSH${Math.floor(Math.random() * 100000)}`;

  // MSH Segment - EPIC Compatible
  const mshSegment = [
    "MSH",
    "|",
    "^~\\&",
    "LIS",
    "TTSHLIS",
    "EMR",
    "TTSHCLOVER",
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
    data.patient_address || "11^JALAN TAN TOCK SENG",
    "",
    data.patient_contact_number || "6666 6666",
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
    "TCDDRAN^NONE^^^TTSH DDR-ANGIO",
    "",
    "",
    "",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "",
    "TSGMD",
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
  // Ensure labAccessionNo is always a string
  const labAccessionNo = String(data.test_case_id || `${currentDateTime}001`);
  console.log(
    "Lab Accession No:",
    labAccessionNo,
    "Type:",
    typeof labAccessionNo
  );

  const orcSegment = [
    "ORC",
    "",
    "^EPC",
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
    "TCDDRAN^^^^TTSH DDR-ANGIO^^^^TTSH DDR-ANGIO",
  ].join("|");

  // OBR Segment - Observation Request
  const obrSegment = [
    "OBR",
    "1",
    "^EPC",
    labAccessionNo + "^TTSHTDNL",
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

  // OBX Segments - Use PGX Panel data if available, otherwise fallback to testResults
  let obxSegments: string[] = [];

  if (data.pgxPanel && data.pgxPanel.length > 0) {
    // Use PGX panel data
    obxSegments = data.pgxPanel.map((result: any, index: number) => {
      const gene = result.gene || "";
      const genotype = result.genotype || "";
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
        "F",
        "",
        "",
        currentDateTime,
        "",
        "",
        phenotype,
      ].join("|");
    });
  } else if (data.testResults && data.testResults.length > 0) {
    // Fallback to testResults
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
        "F",
        "",
        "",
        currentDateTime,
        "",
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
