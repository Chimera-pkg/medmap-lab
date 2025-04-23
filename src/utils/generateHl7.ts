import HL7 from "hl7-standard";

export function buildHL7Message(data: any): string {
  // Construct the MSH segment
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

  // Construct the PID segment
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

  // Construct the OBR segment
  const obrSegment = [
    "OBR",
    "1",
    data.test_case_id,
    "",
    "GENETIC^Genetic Test",
    "",
    data.specimen_received,
  ].join("|");

  // Construct the OBX segment
  const obxSegment = [
    "OBX",
    "1",
    "CE",
    "CYP2C9^CYP2C9 Genotype",
    "",
    data.testResults?.[0].genotype || "",
    "",
    "",
    "",
    "",
    "F",
  ].join("|");

  // Combine all segments into a single HL7 message
  return [mshSegment, pidSegment, obrSegment, obxSegment].join("\r");
}
