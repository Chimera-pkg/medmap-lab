import { PDFDocument, rgb, StandardFonts, PDFPage } from "pdf-lib";
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

// Fungsi pembuat PDF dengan layout multi-page (A4) dan header logo
async function generatePDF(data: any) {
  // Dimensi kertas A4
  const pageWidth = 595;
  const pageHeight = 842;
  const topMargin = 50;
  const bottomMargin = 50;
  const leftMargin = 50;
  const lightBlueColor = rgb(0.85, 0.93, 1);

  // Buat dokumen PDF dan halaman pertama
  const pdfDoc = await PDFDocument.create();
  let page: PDFPage = pdfDoc.addPage([pageWidth, pageHeight]);
  let yPos = pageHeight - topMargin; // Mulai dari atas halaman

  // Embed font standar
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const blueColor = rgb(0, 0.75, 1);

  // --- Fungsi Helper ---
  // Memastikan ruang yang dibutuhkan ada, jika tidak maka buat halaman baru
  function ensureSpace(requiredSpace: number) {
    if (yPos - requiredSpace < bottomMargin) {
      page = pdfDoc.addPage([pageWidth, pageHeight]);
      yPos = pageHeight - topMargin;
    }
  }

  // Fungsi pembungkus teks (word wrap) sederhana
  function wrapText(
    text: string,
    font: any,
    fontSize: number,
    maxWidth: number
  ): string[] {
    const words = text.split(" ");
    let lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + word + " ";
      const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);
      if (testLineWidth > maxWidth) {
        // pindah baris
        lines.push(currentLine.trim());
        currentLine = word + " ";
      } else {
        currentLine = testLine;
      }
    });
    if (currentLine.trim() !== "") {
      lines.push(currentLine.trim());
    }
    return lines;
  }

  // Fungsi untuk menghitung posisi X agar teks center
  function centerX(pageW: number, text: string, fnt: any, fSize: number) {
    return (pageW - fnt.widthOfTextAtSize(text, fSize)) / 2;
  }

  // --- Mulai Menggambar Konten ---

  // === HEADER SECTION: LOGOS AND TEXT ===
  // Constants for the header
  const headerFontSize = 16;
  const subHeaderFontSize = 10;
  const titleFontSize = 14;
  const logoSize = { width: 60, height: 60 };
  const hospitalName = "TAN TOCK SENG HOSPITAL";
  const address = "11 Jalan Tan Tock Seng, Singapore 308433";

  const mdlText = "MOLECULAR DIAGNOSTIC LABORATORY";
  const generalEnquiries = "General Enquiries: 6357 7389";

  // Ensure we have space for the entire header
  ensureSpace(logoSize.height + 60); // Header total height sestimation

  // Load both logos at once
  const hospitalLogoUrl = "/hospital-logo.png";
  const capLogoUrl = "/cap-logo.png";
  const [hospitalLogoBytes, capLogoBytes] = await Promise.all([
    fetch(hospitalLogoUrl).then((res) => res.arrayBuffer()),
    fetch(capLogoUrl).then((res) => res.arrayBuffer()),
  ]);
  const hospitalLogo = await pdfDoc.embedPng(hospitalLogoBytes);
  const capLogo = await pdfDoc.embedPng(capLogoBytes);

  // Draw hospital logo (left)
  page.drawImage(hospitalLogo, {
    x: leftMargin,
    y: yPos - logoSize.height,
    width: logoSize.width,
    height: logoSize.height,
  });

  // Draw CAP logo (right)
  page.drawImage(capLogo, {
    x: pageWidth - leftMargin - logoSize.width,
    y: yPos - logoSize.height,
    width: logoSize.width,
    height: logoSize.height,
  });

  // Calculate text positions
  const textWidthHospitalName = fontBold.widthOfTextAtSize(
    hospitalName,
    headerFontSize
  );

  // Draw hospital name (centered)
  page.drawText(hospitalName, {
    x: (pageWidth - textWidthHospitalName) / 2,
    y: yPos - 20, // Adjust vertical position to align with logos
    size: headerFontSize,
    font: fontBold,
  });

  // Draw address (centered)
  page.drawText(address, {
    x: centerX(pageWidth, address, fontRegular, subHeaderFontSize),
    y: yPos - 35, // Below hospital name
    size: subHeaderFontSize,
    font: fontRegular,
  });

  // Draw Molecular Diagnostic Laboratory text (centered)
  page.drawText(mdlText, {
    x: centerX(pageWidth, mdlText, fontBold, subHeaderFontSize),
    y: yPos - 47, // Below address
    size: subHeaderFontSize,
    font: fontBold,
  });

  // Draw General Enquiries text (centered)
  page.drawText(generalEnquiries, {
    x: centerX(pageWidth, generalEnquiries, fontRegular, subHeaderFontSize),
    y: yPos - 59, // Below MDL text
    size: subHeaderFontSize,
    font: fontRegular,
  });

  // Update yPos after the entire header
  yPos -= logoSize.height + 70; // Adjust based on the full header height

  // === PHARMACOGENOMIC REPORT (center) ===
  ensureSpace(40);
  const reportTitle = "PHARMACOGENOMICS REPORT";
  const reportTitleWidth = fontBold.widthOfTextAtSize(
    reportTitle,
    titleFontSize
  );
  const reportTitleX = (pageWidth - reportTitleWidth) / 2;
  // Buat background warna biru di belakang teks

  page.drawRectangle({
    x: leftMargin,
    y: yPos - 5,
    width: pageWidth - 2 * leftMargin,
    height: 25,
    color: lightBlueColor,
  });
  page.drawText(reportTitle, {
    x: reportTitleX,
    y: yPos,
    size: titleFontSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPos -= 20;

  // === 4 KOLOM: PATIENT, SPECIMEN, ORDERED BY, CASE ===
  const columnTitles = ["PATIENT", "SPECIMEN", "ORDERED BY", "CASE"];
  const columnWidth = (pageWidth - leftMargin * 2) / columnTitles.length;
  const colTitleFontSize = 10;
  // Header kolom
  columnTitles.forEach((title, i) => {
    const xPos = leftMargin + i * columnWidth;
    page.drawText(title, {
      x: xPos,
      y: yPos,
      size: colTitleFontSize,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
  });
  // Garis underline biru untuk masing-masing kolom
  yPos -= 5;
  columnTitles.forEach((_, i) => {
    const xPos = leftMargin + i * columnWidth;
    page.drawLine({
      start: { x: xPos, y: yPos },
      end: { x: xPos + columnWidth - 5, y: yPos },
      thickness: 1,
      color: blueColor,
    });
  });
  yPos -= 15;

  // Data untuk 4 kolom
  const columnData = [
    data.patient || {},
    data.specimen || {},
    data.orderedBy || {},
    data.caseInfo || {},
  ];
  let maxColumnHeight = yPos;
  columnData.forEach((colObj, i) => {
    let tempY = yPos;
    const xPos = leftMargin + i * columnWidth;
    Object.keys(colObj).forEach((key) => {
      const text = `${key}: ${colObj[key]}`;
      ensureSpace(12);
      page.drawText(text, {
        x: xPos,
        y: tempY,
        size: 8,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      tempY -= 12;
    });
    if (tempY < maxColumnHeight) {
      maxColumnHeight = tempY;
    }
  });
  yPos = maxColumnHeight - 20;

  // === TEST INFORMATION (judul dan garis biru) ===
  ensureSpace(30);
  const testInfoTitle = "TEST INFORMATION";
  page.drawText(testInfoTitle, {
    x: leftMargin,
    y: yPos,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPos -= 5;
  // Garis biru di bawah judul
  page.drawLine({
    start: { x: leftMargin, y: yPos },
    end: { x: pageWidth - leftMargin, y: yPos },
    thickness: 2,
    color: blueColor,
  });
  yPos -= 15;

  // Use the `test_information` field from the input data
  const testInfoParagraphs = data.test_information
    ? data.test_information.split("\n") // Split into paragraphs if multiline
    : ["No test information provided."];

  const paragraphFontSize = 9;
  testInfoParagraphs.forEach((para: string) => {
    const wrapped = wrapText(
      para,
      fontRegular,
      paragraphFontSize,
      pageWidth - leftMargin * 2
    );
    wrapped.forEach((line) => {
      ensureSpace(12);
      page.drawText(line, {
        x: leftMargin,
        y: yPos,
        size: paragraphFontSize,
        font: fontRegular,
        color: rgb(0, 0, 0),
      });
      yPos -= 12;
    });
    yPos -= 10;
  });
  yPos -= 10;

  // === RESULT SUMMARY (center, background biru muda, garis horizontal) ===
  ensureSpace(40);
  const resultSummaryTitle = "RESULT SUMMARY";
  page.drawRectangle({
    x: leftMargin,
    y: yPos - 5,
    width: pageWidth - 2 * leftMargin,
    height: 25,
    color: lightBlueColor,
  });
  page.drawLine({
    start: { x: leftMargin, y: yPos + 20 },
    end: { x: pageWidth - leftMargin, y: yPos + 20 },
    thickness: 2,
    color: blueColor,
  });
  const rsWidth = fontBold.widthOfTextAtSize(resultSummaryTitle, 12);
  page.drawText(resultSummaryTitle, {
    x: (pageWidth - rsWidth) / 2,
    y: yPos,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPos -= 35;

  // Use the `lab_result_summary` field from the input data
  const labResultSummary = data.lab_result_summary
    ? data.lab_result_summary.split("\n") // Split into paragraphs if multiline
    : ["No result summary provided."];

  labResultSummary.forEach((line: string) => {
    ensureSpace(12);
    page.drawText(line, {
      x: leftMargin,
      y: yPos,
      size: 9,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    yPos -= 12;
  });
  yPos -= 10;

  // === NOTE (catatan) ===
  ensureSpace(30);
  const noteText =
    data.note || "Note: This is an additional note or disclaimer.";
  const wrappedNote = wrapText(
    noteText,
    fontRegular,
    8,
    pageWidth - leftMargin * 2
  );
  wrappedNote.forEach((line) => {
    ensureSpace(10);
    page.drawText(line, {
      x: leftMargin,
      y: yPos,
      size: 8,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    yPos -= 10;
  });
  yPos -= 20;

  // === TEST RESULT (background biru muda, garis horizontal) ===
  ensureSpace(40);
  const testResultTitle = "TEST RESULT";
  page.drawRectangle({
    x: leftMargin,
    width: pageWidth - 2 * leftMargin,
    height: 25,
    color: lightBlueColor,
  });
  page.drawRectangle({
    x: leftMargin,
    y: yPos - 5,
    width: pageWidth - 2 * leftMargin,
    height: 25,
    color: lightBlueColor,
  });
  page.drawLine({
    start: { x: leftMargin, y: yPos + 20 },
    end: { x: pageWidth - leftMargin, y: yPos + 20 },
    thickness: 2,
    color: blueColor,
  });
  page.drawText(testResultTitle, {
    x: leftMargin + 5,
    y: yPos,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPos -= 40;

  // --- TEST RESULT SECTION (Tabel dengan grid garis) ---

  // Definisikan jumlah kolom dan lebar kolom
  const tableColCount = 8;
  const tableTotalWidth = pageWidth - 2 * leftMargin;
  const colWidth = tableTotalWidth / tableColCount;

  // Atur tinggi header
  const headerMainHeight = 20; // tinggi baris header utama
  const headerSubHeight = 12; // tinggi baris header sub
  const headerTotalHeight = headerMainHeight + headerSubHeight;

  // Fungsi bantu untuk menggambar garis horizontal
  function drawHorizontalLine(yLine: number) {
    page.drawLine({
      start: { x: leftMargin, y: yLine },
      end: { x: leftMargin + tableTotalWidth, y: yLine },
      thickness: 1,
      color: lightBlueColor,
    });
  }

  // Fungsi bantu untuk menggambar garis vertikal
  function drawVerticalLines(yTop: number, yBottom: number) {
    for (let i = 0; i <= tableColCount; i++) {
      const xPos = leftMargin + i * colWidth;
      page.drawLine({
        start: { x: xPos, y: yTop },
        end: { x: xPos, y: yBottom },
        thickness: 1,
        color: lightBlueColor,
      });
    }
  }

  // Simpan posisi awal tabel header
  const tableTopY = yPos;

  // ------- BARIS HEADER 1 (Utama) -------
  let currentY = tableTopY;

  // Header background
  page.drawRectangle({
    x: leftMargin,
    y: currentY - headerMainHeight,
    width: tableTotalWidth,
    height: headerMainHeight,
    color: lightBlueColor,
  });

  // Kolom 1-4 dan kolom 8 pada baris pertama
  const headerFirstRow = [
    "CLINICAL ACTION",
    "DRUG",
    "GENE",
    "GENOTYPE",
    "",
    "",
    "",
    "EVIDENCE",
  ];
  headerFirstRow.forEach((text, i) => {
    if (text) {
      page.drawText(text, {
        x: leftMargin + colWidth * i + 5,
        y: currentY - 15,
        size: 8,
        font: fontBold,
      });
    }
  });

  // Kolom 5-7 (Merged): Drug Response
  const mergedX = leftMargin + colWidth * 4;
  const mergedWidth = colWidth * 3;
  const drText = "DRUG RESPONSE";
  const drTextWidth = fontBold.widthOfTextAtSize(drText, 8);
  page.drawText(drText, {
    x: mergedX + (mergedWidth - drTextWidth) / 2,
    y: currentY - 15,
    size: 8,
    font: fontBold,
  });

  // Gambar garis horizontal di bawah baris header utama
  drawHorizontalLine(currentY - headerMainHeight);

  // ------- BARIS HEADER 2 (Sub) -------
  currentY = currentY - headerMainHeight; // geser ke baris kedua header

  // Sub-header background
  page.drawRectangle({
    x: leftMargin,
    y: currentY - headerSubHeight,
    width: tableTotalWidth,
    height: headerSubHeight,
    color: lightBlueColor,
  });

  // Di baris kedua, hanya muncul di merged area (kolom 5,6,7) dengan label sub kolom.
  page.drawText("TOXICITY", {
    x: leftMargin + colWidth * 4 + 5,
    y: currentY - 10,
    size: 8,
    font: fontBold,
  });
  page.drawText("DOSAGE", {
    x: leftMargin + colWidth * 5 + 5,
    y: currentY - 10,
    size: 8,
    font: fontBold,
  });
  page.drawText("EFFICACY", {
    x: leftMargin + colWidth * 6 + 5,
    y: currentY - 10,
    size: 8,
    font: fontBold,
  });

  // Gambar garis horizontal di bawah header keseluruhan
  drawHorizontalLine(currentY - headerSubHeight);

  // Gambar garis vertikal untuk header
  drawVerticalLines(tableTopY, currentY - headerSubHeight);

  // Update yPos untuk mulai isi tabel (body)
  yPos = currentY - headerSubHeight - 2;

  // ------- BAGIAN BODY (Isi Tabel Test Result) -------
  // Use default 3 rows if no data provided
  const testResults =
    data.testResult && data.testResult.length > 0
      ? data.testResult
      : [
          {
            clinicalAction: "Standard dosing",
            drug: "Warfarin",
            gene: "CYP2C9",
            genotype: "*1/*1",
            toxicity: "Normal",
            dosage: "Standard",
            efficacy: "Normal",
            evidence: "Level 1A",
          },
          {
            clinicalAction: "Recommended dosage reduction",
            drug: "Simvastatin",
            gene: "SLCO1B1",
            genotype: "*5/*5",
            toxicity: "Increased",
            dosage: "Reduced",
            efficacy: "Normal",
            evidence: "Level 1B",
          },
          {
            clinicalAction: "Consider alternative",
            drug: "Clopidogrel",
            gene: "CYP2C19",
            genotype: "*2/*2",
            toxicity: "Normal",
            dosage: "Standard",
            efficacy: "Reduced",
            evidence: "Level 1A",
          },
        ];

  testResults.forEach((row: any, rowIndex: number) => {
    // Simpan posisi baris saat ini (row top)
    const rowTopY = yPos;

    // Add alternating gray background for rows

    const rowValues = [
      row.clinicalAction || "",
      row.drug || "",
      row.gene || "",
      row.genotype || "",
      row.toxicity || "",
      row.dosage || "",
      row.efficacy || "",
      row.evidence || "",
    ];

    // Lakukan word wrap untuk masing-masing kolom dengan font regular (non-bold)
    const wrappedLinesPerCol: string[][] = rowValues.map((val) =>
      wrapText(val, fontRegular, 8, colWidth - 10)
    );

    // Hitung tinggi baris (maksimum dari semua kolom dalam row)
    let maxRowHeight = 0;
    wrappedLinesPerCol.forEach((lines) => {
      const colHeight = lines.length * 10;
      if (colHeight > maxRowHeight) maxRowHeight = colHeight;
    });

    // Ensure minimum row height
    if (maxRowHeight < 20) maxRowHeight = 20;

    // Update the height of the gray background if needed

    // Pastikan cukup ruang untuk baris ini
    ensureSpace(maxRowHeight + 5);

    // Gambar teks di setiap kolom dengan fontRegular (non-bold)
    for (let i = 0; i < tableColCount; i++) {
      let tempY = yPos;
      wrappedLinesPerCol[i].forEach((line) => {
        page.drawText(line, {
          x: leftMargin + i * colWidth + 5,
          y: tempY,
          size: 8,
          font: fontRegular, // Ensure using non-bold font
          color: rgb(0, 0, 0),
        });
        tempY -= 10;
      });
    }

    // Tentukan batas bawah row
    const rowBottomY = yPos - maxRowHeight - 5;

    // Gambar garis horizontal di bawah row tersebut
    drawHorizontalLine(rowBottomY);

    // Gambar garis vertikal pada row
    drawVerticalLines(rowTopY, rowBottomY);

    // Update yPos untuk row selanjutnya
    yPos = rowBottomY;
  });

  // Tambahkan space setelah tabel test result
  yPos -= 20;

  // === GENE FUNCTION (make it similar to TEST RESULT) ===
  ensureSpace(40);
  const geneFunctionTitle = "GENE FUNCTION";
  page.drawRectangle({
    x: leftMargin,
    y: yPos - 5,
    width: pageWidth - 2 * leftMargin,
    height: 25,
    color: lightBlueColor, // Changed from blueColor to lightBlueColor
  });
  page.drawLine({
    start: { x: leftMargin, y: yPos + 20 },
    end: { x: pageWidth - leftMargin, y: yPos + 20 },
    thickness: 2,
    color: blueColor,
  });
  page.drawText(geneFunctionTitle, {
    x: leftMargin + 5,
    y: yPos,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPos -= 30;

  // Tampilkan setiap gene function
  if (data.geneFunction && data.geneFunction.length > 0) {
    data.geneFunction.forEach((gene: any, geneIndex: number) => {
      ensureSpace(40);

      // Alternate gray background for gene function rows

      // Kiri: Gene Title (misal "CYP2C9")
      page.drawText(gene.name || "Gene Name", {
        x: leftMargin,
        y: yPos,
        size: 10,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      // Kanan: metabolizer (misal "Normal Metabolizer *1/*1")
      const metabolizerText = gene.metabolizer || "Normal Metabolizer";
      const textWidth = fontBold.widthOfTextAtSize(metabolizerText, 10);
      page.drawText(metabolizerText, {
        x: pageWidth - leftMargin - textWidth,
        y: yPos,
        size: 10,
        font: fontBold,
        color: rgb(0, 0, 0),
      });

      // Horizontal line under gene title
      page.drawLine({
        start: { x: leftMargin, y: yPos - 5 },
        end: { x: pageWidth - leftMargin, y: yPos - 5 },
        thickness: 1,
        color: lightBlueColor,
      });

      // Turunkan yPos sedikit
      yPos -= 15;

      // Paragraf detail
      const detailsText = gene.details || "Gene function details go here...";
      const wrappedGeneDetails = wrapText(
        detailsText,
        fontRegular,
        8,
        pageWidth - 2 * leftMargin
      );
      wrappedGeneDetails.forEach((line) => {
        ensureSpace(10);
        page.drawText(line, {
          x: leftMargin,
          y: yPos,
          size: 8,
          font: fontRegular,
          color: rgb(0, 0, 0),
        });
        yPos -= 10;
      });
      yPos -= 20;
    });
  }
  // Simpan PDF dan kembalikan Blob
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export default generatePDF;
