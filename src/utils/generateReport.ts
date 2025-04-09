import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

export async function generateReport(data: any, fileName: string) {
  const pdfBytes = await createPDF(data);

  // Save the PDF using file-saver
  const blob = new Blob([pdfBytes], { type: "application/pdf" });
  saveAs(blob, fileName);
}

export async function generateReportBlob(data: any): Promise<Blob> {
  const pdfBytes = await createPDF(data);
  return new Blob([pdfBytes], { type: "application/pdf" });
}

async function createPDF(data: any): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Add a page
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const { width, height } = page.getSize();

  const margin = 50;
  let yPosition = height - margin;

  // Draw header
  page.drawText("TAN TOCK SENG HOSPITAL", {
    x: margin,
    y: yPosition,
    size: 18,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 20;
  page.drawText("11 Jalan Tan Tock Seng, Singapore 308433", {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 15;
  page.drawText("MOLECULAR DIAGNOSTIC LABORATORY", {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 15;
  page.drawText("General Enquiries: 6357 7389", {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 30;

  // Draw title
  page.drawText("PHARMACOGENOMICS REPORT", {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0, 0.5, 1),
  });

  yPosition -= 20;

  // Draw patient information
  const patientInfo = formatSection(data.patient, "Patient");
  page.drawText(patientInfo, {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 50;

  // Draw specimen information
  const specimenInfo = formatSection(data.specimen, "Specimen");
  page.drawText(specimenInfo, {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 50;

  // Draw test information
  page.drawText("TEST INFORMATION", {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.5, 1),
  });

  yPosition -= 15;
  const testInfo =
    data.testInformation?.join("\n") || "No test information provided.";
  page.drawText(testInfo, {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 50;

  // Draw result summary
  page.drawText("RESULT SUMMARY", {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.5, 1),
  });

  yPosition -= 15;
  page.drawText("Warfarin (2.86mg)", {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  yPosition -= 50;

  // Draw test results table
  page.drawText("TEST RESULT", {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.5, 1),
  });

  yPosition -= 15;
  const tableHeader =
    "Clinical Action | Drug/Gene/Genotype/Phenotype/Drug Response | Evidence";
  page.drawText(tableHeader, {
    x: margin,
    y: yPosition,
    size: 10,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  yPosition -= 15;
  const testResults = data.testResult || [];
  testResults.forEach((row: any) => {
    const rowText = `${row.clinicalAction || ""} | ${
      row.drugGeneInfo || ""
    } | ${row.evidence || ""}`;
    page.drawText(rowText, {
      x: margin,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 15;
  });

  if (testResults.length === 0) {
    page.drawText("No test results available.", {
      x: margin,
      y: yPosition,
      size: 10,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= 15;
  }

  yPosition -= 30;

  // Draw note
  page.drawText("Note:", {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: rgb(0, 0.5, 1),
  });

  yPosition -= 15;
  page.drawText(data.note || "No additional notes provided.", {
    x: margin,
    y: yPosition,
    size: 10,
    font,
    color: rgb(0, 0, 0),
  });

  // Serialize the PDF to bytes
  return pdfDoc.save();
}

function formatSection(data: any, title: string): string {
  if (!data) return `${title}: No data available.`;
  return `${title}:\n${Object.entries(data)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n")}`;
}
