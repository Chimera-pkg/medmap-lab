import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

// Original function with download
export async function generateReport(data: any, fileName: string) {
  // Create PDF
  const blob = await generatePDF(data);

  // Save/download the PDF
  saveAs(blob, fileName);

  // Return the blob for server upload if needed
  return blob;
}

// New function without download
export async function generateReportBlob(data: any) {
  // Just create and return the PDF blob without downloading
  return await generatePDF(data);
}

// Common PDF generation logic
async function generatePDF(data: any) {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Add a page to the document
  const page = pdfDoc.addPage([595, 842]); // A4 size

  // Embed the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Set font size and line height
  const fontSize = 10;
  const lineHeight = 15;

  // Draw header
  page.drawText("TAN TOCK SENG HOSPITAL", {
    x: 50,
    y: 800,
    size: 18,
    font: boldFont,
  });

  page.drawText("11 Jalan Tan Tock Seng, Singapore 308433", {
    x: 300,
    y: 780,
    size: 10,
    font,
  });

  // Draw title
  page.drawText("PHARMACOGENOMICS REPORT", {
    x: 180,
    y: 740,
    size: 14,
    font: boldFont,
    color: rgb(0, 0.75, 1),
  });

  // Draw sections
  let yPos = 700;

  // Patient section
  page.drawText("PATIENT", { x: 50, y: yPos, size: 12, font: boldFont });
  yPos -= 20;

  Object.entries(data.patient).forEach(([key, value]) => {
    page.drawText(`${key}: ${value || "N/A"}`, {
      x: 50,
      y: yPos,
      size: fontSize,
      font,
    });
    yPos -= lineHeight;
  });

  yPos -= 10;

  // Specimen section
  page.drawText("SPECIMEN", { x: 50, y: yPos, size: 12, font: boldFont });
  yPos -= 20;

  Object.entries(data.specimen).forEach(([key, value]) => {
    page.drawText(`${key}: ${value || "N/A"}`, {
      x: 50,
      y: yPos,
      size: fontSize,
      font,
    });
    yPos -= lineHeight;
  });

  yPos -= 10;

  // Ordered By section
  page.drawText("ORDERED BY", { x: 50, y: yPos, size: 12, font: boldFont });
  yPos -= 20;

  Object.entries(data.orderedBy).forEach(([key, value]) => {
    page.drawText(`${key}: ${value || "N/A"}`, {
      x: 50,
      y: yPos,
      size: fontSize,
      font,
    });
    yPos -= lineHeight;
  });

  yPos -= 10;

  // Case Info section
  page.drawText("CASE", { x: 50, y: yPos, size: 12, font: boldFont });
  yPos -= 20;

  Object.entries(data.caseInfo).forEach(([key, value]) => {
    page.drawText(`${key}: ${value || "N/A"}`, {
      x: 50,
      y: yPos,
      size: fontSize,
      font,
    });
    yPos -= lineHeight;
  });

  yPos -= 20;

  // Test Results table
  page.drawText("TEST RESULTS", { x: 50, y: yPos, size: 12, font: boldFont });
  yPos -= 20;

  // Table headers
  const headers = [
    "Drug",
    "Gene",
    "Genotype",
    "Phenotype",
    "Toxicity",
    "Dosage",
    "Efficacy",
  ];
  const colWidths = [80, 80, 80, 90, 80, 80, 80];
  let xPos = 50;

  headers.forEach((header, i) => {
    page.drawText(header, { x: xPos, y: yPos, size: 8, font: boldFont });
    xPos += colWidths[i];
  });

  yPos -= 15;

  // Table rows
  data.testResults.forEach((row: any) => {
    xPos = 50;
    const values = [
      row.drug,
      row.gene,
      row.genotype,
      row.phenotype,
      row.toxicity,
      row.dosage,
      row.efficacy,
    ];

    values.forEach((value, i) => {
      page.drawText(value || "-", { x: xPos, y: yPos, size: 8, font });
      xPos += colWidths[i];
    });

    yPos -= 15;
  });

  yPos -= 30;

  // Footer
  const footerText = data.footerText;
  const textWidth = 500;
  const words = footerText.split(" ");
  let line = "";

  words.forEach((word: string) => {
    const testLine = line + word + " ";
    if (font.widthOfTextAtSize(testLine, 7) > textWidth) {
      page.drawText(line, { x: 50, y: yPos, size: 7, font });
      line = word + " ";
      yPos -= 10;
    } else {
      line = testLine;
    }
  });

  if (line) {
    page.drawText(line, { x: 50, y: yPos, size: 7, font });
  }

  // Save the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
