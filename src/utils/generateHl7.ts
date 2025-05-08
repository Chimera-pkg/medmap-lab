export function buildHL7Message(data: any): string {
  console.log("Data received in buildHL7Message:", data);

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

  const obxSegments = data.testResults.map((result: any, index: number) => {
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
      "F",
    ].join("|");
  });

  console.log("Generated OBX Segments:", obxSegments);

  return [mshSegment, pidSegment, obrSegment, ...obxSegments].join("\r");
}
