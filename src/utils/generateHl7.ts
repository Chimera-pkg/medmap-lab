import HL7 from "hl7-standard";

export function buildHL7Message(data: any): string {
  // Buat instance HL7 dengan delimiter standar
  const msg = new HL7("", { lineEndings: "\r" });

  // MSH Segment
  msg
    .createSegment("MSH")
    .setField(1, "|")
    .setField(2, "^~\\&")
    .setField(3, "TTSH")
    .setField(4, "LabApp")
    .setField(5, "ReceiverApp")
    .setField(6, "ReceiverFac")
    .setField(7, new Date().toISOString().replace(/[-:]/g, "").slice(0, 14))
    .setField(9, "ORU^R01")
    .setField(10, "12345")
    .setField(11, "P")
    .setField(12, "2.5");

  // PID Segment
  const pid = msg.createSegment("PID");
  pid.setField(1, "1");
  pid.setField(3, `${data.mrn}^^^Hosp^MR^ISO`);
  pid.setField(
    5,
    `${data.patient_name.split(" ")[1]}^${data.patient_name.split(" ")[0]}`
  );
  pid.setField(7, data.date_of_birth);
  pid.setField(8, data.sex);

  // OBR Segment
  const obr = msg.createSegment("OBR");
  obr.setField(1, "1");
  obr.setField(2, data.test_case_id);
  obr.setField(4, `GENETIC^Genetic Test`);
  obr.setField(7, data.specimen_received);

  // OBX Segment (contoh satu hasil)
  const obx = msg.createSegment("OBX");
  obx.setField(1, "1");
  obx.setField(2, "CE");
  obx.setField(3, `CYP2C9^CYP2C9 Genotype`);
  obx.setField(5, data.testResults?.[0].genotype);
  obx.setField(11, "F");

  // Kembalikan string HL7
  return msg.build();
}
