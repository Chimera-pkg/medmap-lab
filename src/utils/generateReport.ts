import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { saveAs } from "file-saver";

// Fungsi untuk generate dan download report PDF
export async function generateReport(data: any, fileName: string) {
  const blob = await generatePDF(data);
  saveAs(blob, fileName);
  return blob;
}

// Fungsi untuk generate PDF dan mengembalikan blob tanpa download
export async function generateReportBlob(data: any) {
  return await generatePDF(data);
}

// Fungsi pembuat PDF dengan layout baru dan header logo menggunakan public asset
async function generatePDF(data: any) {
  // Membuat dokumen PDF dan halaman A4
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595, 842]);
  const pageWidth = page.getWidth();
  const leftMargin = 50;

  // Embed font standar
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // === Load logo dari public assets ===
  // Pastikan file logo tersedia di folder public, misalnya "/hospital-logo.png" dan "/cap-logo.png"
  // Load logos
  const hospitalLogoUrl = "/hospital-logo.png";
  const capLogoUrl = "/cap-logo.png";
  const hospitalLogoBytes = await fetch(hospitalLogoUrl).then((res) =>
    res.arrayBuffer()
  );
  const capLogoBytes = await fetch(capLogoUrl).then((res) => res.arrayBuffer());
  const hospitalLogo = await pdfDoc.embedPng(hospitalLogoBytes);
  const capLogo = await pdfDoc.embedPng(capLogoBytes);

  // Draw logos
  page.drawImage(hospitalLogo, {
    x: leftMargin,
    y: 780,
    width: 447.48 / 2, // Scale down by 50%
    height: 168 / 2,
  });

  page.drawImage(capLogo, {
    x: pageWidth - leftMargin - 333.14 / 2, // Align to the right
    y: 780,
    width: 333.14 / 2, // Scale down by 50%
    height: 191 / 2,
  });

  // Draw header text
  const headerFontSize = 18;
  const subHeaderFontSize = 10;
  const titleFontSize = 14;
  const blueColor = rgb(0, 0.75, 1);

  // Nama Rumah Sakit (center aligned)
  const hospitalName = "TAN TOCK SENG HOSPITAL";
  page.drawText(hospitalName, {
    x:
      (pageWidth - fontBold.widthOfTextAtSize(hospitalName, headerFontSize)) /
      2,
    y: 800,
    size: headerFontSize,
    font: fontBold,
  });

  // Alamat
  const address = "11 Jalan Tan Tock Seng, Singapore 308433";
  page.drawText(address, {
    x:
      (pageWidth - fontRegular.widthOfTextAtSize(address, subHeaderFontSize)) /
      2,
    y: 785,
    size: subHeaderFontSize,
    font: fontRegular,
  });

  // Add "Molecular Diagnostic Laboratory" and "General Enquiries"
  page.drawText("MOLECULAR DIAGNOSTIC LABORATORY", {
    x:
      (pageWidth -
        fontBold.widthOfTextAtSize(
          "MOLECULAR DIAGNOSTIC LABORATORY",
          subHeaderFontSize
        )) /
      2,
    y: 770,
    size: subHeaderFontSize,
    font: fontBold,
  });

  page.drawText("General Enquiries: 6357 7389", {
    x:
      (pageWidth -
        fontRegular.widthOfTextAtSize(
          "General Enquiries: 6357 7389",
          subHeaderFontSize
        )) /
      2,
    y: 755,
    size: subHeaderFontSize,
    font: fontRegular,
  });

  // Draw "Pharmacogenomics Report" with background
  const reportTitle = "PHARMACOGENOMICS REPORT";
  const reportTitleWidth = fontBold.widthOfTextAtSize(
    reportTitle,
    titleFontSize
  );
  const reportTitleX = (pageWidth - reportTitleWidth) / 2;

  page.drawRectangle({
    x: reportTitleX - 10, // Add padding
    y: 735,
    width: reportTitleWidth + 20,
    height: 25,
    color: blueColor,
  });

  page.drawText(reportTitle, {
    x: reportTitleX,
    y: 740,
    size: titleFontSize,
    font: fontBold,
    color: rgb(0, 0, 0), // Black text
  });

  // === Mulai bagian isi report ===
  // Atur posisi y untuk mulai menggambar bagian bawah header
  let yPos = 720;

  // Fungsi untuk menggambar header section dengan latar belakang biru
  function drawBlueHeader(text: string) {
    const headerWidth = fontBold.widthOfTextAtSize(text, 12);
    page.drawRectangle({
      x: leftMargin,
      y: yPos - 5,
      width: headerWidth + 10,
      height: 20,
      color: blueColor,
    });
    page.drawText(text, {
      x: leftMargin + 5,
      y: yPos,
      size: 12,
      font: fontBold,
      color: rgb(1, 1, 1),
    });
    yPos -= 30;
  }

  // Fungsi untuk menggambar data dalam format key-value
  function drawKeyValueSection(dataSection: any) {
    Object.entries(dataSection).forEach(([key, value]) => {
      page.drawText(`${key}: ${value || "N/A"}`, {
        x: leftMargin,
        y: yPos,
        size: 10,
        font: fontRegular,
      });
      yPos -= 15;
    });
    yPos -= 10;
  }

  // Bagian PATIENT
  drawBlueHeader("PATIENT");
  drawKeyValueSection(data.patient);

  // Bagian SPECIMEN
  drawBlueHeader("SPECIMEN");
  drawKeyValueSection(data.specimen);

  // Bagian ORDERED BY
  drawBlueHeader("ORDERED BY");
  drawKeyValueSection(data.orderedBy);

  // Bagian CASE
  drawBlueHeader("CASE");
  drawKeyValueSection(data.caseInfo);

  // Bagian TEST RESULTS (tabel)
  drawBlueHeader("TEST RESULTS");
  const headers = [
    "Drug",
    "Gene",
    "Genotype",
    "Phenotype",
    "Toxicity",
    "Dosage",
    "Efficacy",
  ];
  const colWidth = (pageWidth - leftMargin * 2) / headers.length;
  let xPos = leftMargin;
  headers.forEach((header) => {
    page.drawText(header, {
      x: xPos,
      y: yPos,
      size: 10,
      font: fontBold,
    });
    xPos += colWidth;
  });
  yPos -= 15;

  data.testResults.forEach((row: any) => {
    xPos = leftMargin;
    const values = [
      row.drug,
      row.gene,
      row.genotype,
      row.phenotype,
      row.toxicity,
      row.dosage,
      row.efficacy,
    ];
    values.forEach((value) => {
      page.drawText(value || "-", {
        x: xPos,
        y: yPos,
        size: 10,
        font: fontRegular,
      });
      xPos += colWidth;
    });
    yPos -= 15;
  });

  // === Footer dengan word wrapping ===
  yPos -= 30;
  const footerText = data.footerText;
  const footerFontSize = 7;
  const footerWidth = pageWidth - leftMargin * 2;
  const words = footerText.split(" ");
  let line = "";

  words.forEach((word: string) => {
    const testLine = line + word + " ";
    if (fontRegular.widthOfTextAtSize(testLine, footerFontSize) > footerWidth) {
      page.drawText(line, {
        x: leftMargin,
        y: yPos,
        size: footerFontSize,
        font: fontRegular,
      });
      line = word + " ";
      yPos -= 10;
    } else {
      line = testLine;
    }
  });
  if (line) {
    page.drawText(line, {
      x: leftMargin,
      y: yPos,
      size: footerFontSize,
      font: fontRegular,
    });
  }

  // Simpan PDF dan kembalikan Blob
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
