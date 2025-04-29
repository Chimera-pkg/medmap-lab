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

  // === HEADER SECTION: LOGOS AND TEXT ===
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

  // LOGO CONFIG
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

  // === PHARMACOGENOMIC REPORT LOGO
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

  // === RESULT SUMMARY
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

  // === TEST RESULT
  ensureSpace(40);
  const testResultTitle = "TEST RESULTS";

  // Hitung posisi X agar teks berada di tengah
  const testResultTitleWidth = fontBold.widthOfTextAtSize(testResultTitle, 12);
  const testResultTitleX = (pageWidth - testResultTitleWidth) / 2;

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
    x: testResultTitleX, // Gunakan posisi X yang sudah dihitung
    y: yPos,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPos -= 10;

  // --- TEST RESULT SECTION TABLES

  // Definisikan jumlah kolom dan lebar kolom
  const tableColCount = 8;
  const tableTotalWidth = pageWidth - 2 * leftMargin;
  const colWidth = tableTotalWidth / tableColCount;

  // Atur tinggi header
  const headerMainHeight = 20; // tinggi baris header utama
  const headerSubHeight = 20; // tinggi baris header sub
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

  yPos -= 20;

  // Tambahkan kolom Phenotype dan sub-kolom untuk Drug Response
  const headerFirstRow = [
    "CLINICAL\nACTION",
    "DRUG",
    "GENE",
    "GENOTYPE",
    "PHENOTYPE",
    "",
    "",
    "EVIDENCE",
  ];
  headerFirstRow.forEach((text, i) => {
    if (text) {
      page.drawText(text, {
        x: leftMargin + colWidth * i + 5,
        y: currentY - 15,
        size: 7, // Font lebih kecil
        font: fontBold,
      });
    }
  });

  // Kolom 5-7 (Merged): Drug Response
  const mergedX = leftMargin + colWidth * 4;
  const mergedWidth = colWidth * 3;
  const drText = "DRUG RESPONSE";
  const drTextWidth = fontBold.widthOfTextAtSize(drText, 7);
  page.drawText(drText, {
    x: mergedX + (mergedWidth - drTextWidth) / 2,
    y: currentY - 15,
    size: 7, // Font lebih kecil
    font: fontBold,
  });

  // Gambar garis horizontal di bawah baris header utama
  drawHorizontalLine(currentY - headerMainHeight);

  // ------- BARIS HEADER 2 (Sub) -------
  currentY = currentY - headerMainHeight; // Geser ke baris kedua header

  // Sub-header background
  page.drawRectangle({
    x: leftMargin,
    y: currentY - headerSubHeight,
    width: tableTotalWidth,
    height: headerSubHeight,
    color: lightBlueColor,
  });

  // Sub-kolom untuk Drug Response
  page.drawText("TOXICITY", {
    x: leftMargin + colWidth * 4 + 5,
    y: currentY - 10,
    size: 7, // Font lebih kecil
    font: fontBold,
  });
  page.drawText("DOSAGE", {
    x: leftMargin + colWidth * 5 + 5,
    y: currentY - 10,
    size: 7, // Font lebih kecil
    font: fontBold,
  });
  page.drawText("EFFICACY", {
    x: leftMargin + colWidth * 6 + 5,
    y: currentY - 10,
    size: 7, // Font lebih kecil
    font: fontBold,
  });

  // Gambar garis horizontal di bawah header keseluruhan
  drawHorizontalLine(currentY - headerSubHeight);

  // Gambar garis vertikal untuk header
  drawVerticalLines(tableTopY, currentY - headerSubHeight);

  // Update yPos untuk mulai isi tabel (body)
  yPos = currentY - headerSubHeight - 2;

  // ------- BAGIAN BODY (Isi Tabel Test Result) -------
  const testResults = [
    {
      clinicalAction: " Standard dosing",
      drug: "Warfarin",
      gene: ["CYP2C9", "VKORC1"],
      genotype: ["*1/*1", "*2/*2"],
      phenotype: ["Normal Metabolizer", "Reduced Metabolizer"],
      toxicity: "-",
      dosage: "-",
      efficacy: "",
      evidence: ["DFA", "FDA, DPWG, L1"],
    },
  ];

  // ------- BAGIAN BODY (Isi Tabel Test Result) -------
  testResults.forEach((row: any, rowIndex: number) => {
    // Simpan posisi baris saat ini (row top)
    const rowTopY = yPos;

    // Split rows for columns with arrays (GENE, GENOTYPE, PHENOTYPE)
    const maxRows = Math.max(
      row.gene.length,
      row.genotype.length,
      row.phenotype.length
    );

    for (let i = 0; i < maxRows; i++) {
      // Values for the current row
      const clinicalAction = i === 0 ? row.clinicalAction || "" : ""; // Only show for the first row
      const drug = i === 0 ? row.drug || "" : ""; // Only show for the first row
      const gene = row.gene[i] || ""; // Show current gene
      const genotype = row.genotype[i] || ""; // Show current genotype
      const phenotype = row.phenotype[i] || ""; // Show current phenotype
      const toxicity = i === 0 ? row.toxicity || "-" : ""; // Only show for the first row
      const dosage = i === 0 ? row.dosage || "-" : ""; // Only show for the first row
      const efficacy = i === 0 ? row.efficacy || "-" : ""; // Only show for the first row
      const evidence = i === 0 ? row.evidence.join(", ") || "" : ""; // Only show for the first row

      const rowValues = [
        clinicalAction,
        drug,
        gene,
        genotype,
        phenotype,
        toxicity,
        dosage,
        efficacy,
        evidence,
      ];

      // Lakukan word wrap untuk masing-masing kolom dengan font regular (non-bold)
      const wrappedLinesPerCol: string[][] = rowValues.map(
        (val) => wrapText(val, fontRegular, 7, colWidth - 10) // Font lebih kecil
      );

      // Hitung tinggi baris (maksimum dari semua kolom dalam row)
      let maxRowHeight = 0;
      wrappedLinesPerCol.forEach((lines) => {
        const colHeight = lines.length * 10;
        if (colHeight > maxRowHeight) maxRowHeight = colHeight;
      });

      // Ensure minimum row height
      if (maxRowHeight < 20) maxRowHeight = 20;

      // Pastikan cukup ruang untuk baris ini
      ensureSpace(maxRowHeight + 5);

      // Gambar teks di setiap kolom dengan fontRegular (non-bold)
      for (let j = 0; j < tableColCount; j++) {
        let tempY = yPos - 8;
        wrappedLinesPerCol[j].forEach((line) => {
          page.drawText(line, {
            x: leftMargin + j * colWidth + 5,
            y: tempY,
            size: 7, // Font lebih kecil
            font: fontRegular,
            color: rgb(0, 0, 0),
          });
          tempY -= 10;
        });
      }

      // Update yPos untuk row berikutnya
      yPos -= maxRowHeight + 5;

      // Gambar garis horizontal di bawah row tersebut
      drawHorizontalLine(yPos);
    }

    // Gambar garis vertikal pada row
    drawVerticalLines(rowTopY, yPos);
  });

  // Tambahkan space setelah tabel test result
  yPos -= 20;

  // TEST RESULT END

  // Tambahkan space setelah tabel test result
  yPos -= 20;

  // === GENE FUNCTION
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
  } else {
    // Placeholder text when no gene function data is available
    ensureSpace(40);

    const placeholderText =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    const wrappedPlaceholder = wrapText(
      placeholderText,
      fontRegular,
      8,
      pageWidth - 2 * leftMargin
    );

    wrappedPlaceholder.forEach((line) => {
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
  }
  // Simpan PDF dan kembalikan Blob
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export default generatePDF;
