export function buildHL7Message(data: any): string {
  console.log("Data received in buildHL7Message:", data);

  // MSH Segment
  const mshSegment = [
    "MSH",
    "|",
    "^~\\&",
    "TTSH",
    "LabApp",
    "ReceiverApp",
    "ReceiverFac",
    new Date().toISOString().replace(/[-:]/g, "").slice(0, 14),
    "",
    "ORU^R01",
    "12345",
    "P",
    "2.5",
  ].join("|");

  // PID Segment
  const pidSegment = [
    "PID",
    "1",
    `${data.mrn}^^^Hosp^MR^ISO`,
    "",
    `${data.patient_name.split(" ")[1]}^${data.patient_name.split(" ")[0]}`,
    "",
    data.date_of_birth,
    data.sex,
  ].join("|");

  // OBR Segment
  const obrSegment = [
    "OBR",
    "1",
    data.test_case_id,
    "",
    "GENETIC^Genetic Test",
    "",
    data.specimen_received,
  ].join("|");

  console.log("Test Results:", data.testResults);

  // OBX Segments
  const obxSegments = data.testResults.map((result: any, index: number) => {
    const clinicalAnnotation =
      result.clinicalannotation || "No Clinical Annotation provided.";

    return [
      "OBX",
      index + 1,
      "CWE",
      `Drug: ${result.drug}`,
      `Gene: ${
        Array.isArray(result.gene) ? result.gene.join(", ") : result.gene
      }`,
      `Genotype: ${
        Array.isArray(result.genotype)
          ? result.genotype.join(", ")
          : result.genotype
      }`,
      `Phenotype: ${result.phenotype || "N/A"}`,
      `Toxicity: ${result.toxicity || "N/A"}`,
      `Dosage: ${result.dosage || "N/A"}`,
      `Efficacy: ${result.efficacy || "N/A"}`,
      `Evidence: ${result.evidence || "N/A"}`,
      `Clinical Action: ${clinicalAnnotation}`,
      "F",
    ].join("|");
  });

  console.log("Generated OBX Segments:", obxSegments);

  // Combine all segments
  return [mshSegment, pidSegment, obrSegment, ...obxSegments].join("\r");
}
