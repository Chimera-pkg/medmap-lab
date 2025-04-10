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

  // === LOAD ASSET LOGO DARI PUBLIC FOLDER ===
  const hospitalLogoUrl = "/hospital-logo.png";
  const capLogoUrl = "/cap-logo.png";
  const [hospitalLogoBytes, capLogoBytes] = await Promise.all([
    fetch(hospitalLogoUrl).then((res) => res.arrayBuffer()),
    fetch(capLogoUrl).then((res) => res.arrayBuffer()),
  ]);
  const hospitalLogo = await pdfDoc.embedPng(hospitalLogoBytes);
  const capLogo = await pdfDoc.embedPng(capLogoBytes);

  // === PENGATURAN UKURAN LOGO (60 x 60) ===
  const logoSize = { width: 60, height: 60 };

  // Pastikan ada ruang untuk logo
  ensureSpace(logoSize.height);
  // Gambar logo Rumah Sakit (kiri)
  page.drawImage(hospitalLogo, {
    x: leftMargin,
    y: yPos - logoSize.height,
    width: logoSize.width,
    height: logoSize.height,
  });
  // Gambar logo CAP (kanan)
  page.drawImage(capLogo, {
    x: pageWidth - leftMargin - logoSize.width,
    y: yPos - logoSize.height,
    width: logoSize.width,
    height: logoSize.height,
  });
  yPos -= logoSize.height + 10;

  // === HEADER TEKS ===
  const headerFontSize = 16;
  const subHeaderFontSize = 10;
  const titleFontSize = 14;

  // Nama Rumah Sakit (center aligned)
  ensureSpace(20);
  const hospitalName = "TAN TOCK SENG HOSPITAL";
  const textWidthHospitalName = fontBold.widthOfTextAtSize(
    hospitalName,
    headerFontSize
  );
  page.drawText(hospitalName, {
    x: (pageWidth - textWidthHospitalName) / 2,
    y: yPos,
    size: headerFontSize,
    font: fontBold,
  });
  yPos -= 15;

  // Alamat
  ensureSpace(15);
  const address = "11 Jalan Tan Tock Seng, Singapore 308433";
  page.drawText(address, {
    x: centerX(pageWidth, address, fontRegular, subHeaderFontSize),
    y: yPos,
    size: subHeaderFontSize,
    font: fontRegular,
  });
  yPos -= 12;

  // Molecular Diagnostic Laboratory
  ensureSpace(15);
  const mdlText = "MOLECULAR DIAGNOSTIC LABORATORY";
  page.drawText(mdlText, {
    x: centerX(pageWidth, mdlText, fontBold, subHeaderFontSize),
    y: yPos,
    size: subHeaderFontSize,
    font: fontBold,
  });
  yPos -= 12;

  // General Enquiries
  ensureSpace(15);
  const generalEnquiries = "General Enquiries: 6357 7389";
  page.drawText(generalEnquiries, {
    x: centerX(pageWidth, generalEnquiries, fontRegular, subHeaderFontSize),
    y: yPos,
    size: subHeaderFontSize,
    font: fontRegular,
  });
  yPos -= 12;

  // --- Jarak 20 px setelah General Enquiries ---
  ensureSpace(20);
  yPos -= 20;

  // === PHARMACOGENOMIC REPORT (center) ===
  ensureSpace(40);
  const reportTitle = "PHARMACOGENOMICS REPORT";
  const reportTitleWidth = fontBold.widthOfTextAtSize(
    reportTitle,
    titleFontSize
  );
  const reportTitleX = (pageWidth - reportTitleWidth) / 2;
  // Buat background warna biru di belakang teks
  const bgHeight = 25;
  page.drawRectangle({
    x: reportTitleX - 10,
    y: yPos - 5,
    width: reportTitleWidth + 20,
    height: bgHeight,
    color: blueColor,
  });
  page.drawText(reportTitle, {
    x: reportTitleX,
    y: yPos,
    size: titleFontSize,
    font: fontBold,
    color: rgb(0, 0, 0),
  });
  yPos -= 50;

  // === 4 KOLOM: PATIENT, SPECIMEN, ORDERED BY, CASE ===
  ensureSpace(50);
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
      color: blueColor,
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

  // Contoh 2 paragraf untuk test information
  const testInfoParagraphs = data.testInformation || [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque, sapien vitae sodales suscipit, ligula eros convallis mauris, sed euismod dui lectus vel neque.",
    "Sed tincidunt lectus enim, vitae hendrerit neque aliquet non. Phasellus neque nulla, dapibus ac pellentesque sed, pretium tempus nisl.",
  ];
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
  const lightBlueColor = rgb(0.85, 0.93, 1);
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

  // === 2 BARIS: BACKGROUND GREY, dan TULISAN "WARFARIN (2.86mg)" ===
  ensureSpace(50);
  const greyColor = rgb(0.9, 0.9, 0.9);
  for (let i = 0; i < 2; i++) {
    page.drawRectangle({
      x: leftMargin,
      y: yPos,
      width: pageWidth - 2 * leftMargin,
      height: 20,
      color: greyColor,
    });
    const warfarinText = "Warfarin (2.86mg)";
    page.drawText(warfarinText, {
      x: leftMargin + 30,
      y: yPos + 5,
      size: 9,
      font: fontBold,
      color: rgb(0, 0, 0),
    });
    yPos -= 20;
  }
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

  // Pastikan ada ruang untuk header tabel
  ensureSpace(40);

  // Definisikan jumlah kolom dan lebar kolom
  // Total kolom fisik = 8, karena:
  // 1. Clinical Action
  // 2. Drug
  // 3. Gene
  // 4. Genotype
  // 5. Toxicity      <- sub kolom dari Drug Response
  // 6. Dosage        <- sub kolom dari Drug Response
  // 7. Efficacy      <- sub kolom dari Drug Response
  // 8. Evidence
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
      color: rgb(0, 0, 0),
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
        color: rgb(0, 0, 0),
      });
    }
  }

  // Simpan posisi awal tabel header
  const tableTopY = yPos;

  // ------- BARIS HEADER 1 (Utama) -------
  let currentY = tableTopY;

  // Kolom 1: Clinical Action
  page.drawText("CLINICAL ACTION", {
    x: leftMargin + 5,
    y: currentY - 15,
    size: 8,
    font: fontBold,
  });

  // Kolom 2: Drug
  page.drawText("DRUG", {
    x: leftMargin + colWidth * 1 + 5,
    y: currentY - 15,
    size: 8,
    font: fontBold,
  });

  // Kolom 3: Gene
  page.drawText("GENE", {
    x: leftMargin + colWidth * 2 + 5,
    y: currentY - 15,
    size: 8,
    font: fontBold,
  });

  // Kolom 4: Genotype
  page.drawText("GENOTYPE", {
    x: leftMargin + colWidth * 3 + 5,
    y: currentY - 15,
    size: 8,
    font: fontBold,
  });

  // Kolom 5-7 (Merged): Drug Response
  // Hitung posisi merged area, mulai dari kolom ke-5 hingga kolom ke-7
  const mergedX = leftMargin + colWidth * 4;
  const mergedWidth = colWidth * 3;
  // Tuliskan text "DRUG RESPONSE" di tengah merged area (header utama)
  const drText = "DRUG RESPONSE";
  const drTextWidth = fontBold.widthOfTextAtSize(drText, 8);
  page.drawText(drText, {
    x: mergedX + (mergedWidth - drTextWidth) / 2,
    y: currentY - 15,
    size: 8,
    font: fontBold,
  });

  // Kolom 8: Evidence
  page.drawText("EVIDENCE", {
    x: leftMargin + colWidth * 7 + 5,
    y: currentY - 15,
    size: 8,
    font: fontBold,
  });

  // Gambar garis horizontal di bawah baris header utama
  drawHorizontalLine(currentY - headerMainHeight);

  // ------- BARIS HEADER 2 (Sub) -------
  currentY = currentY - headerMainHeight; // geser ke baris kedua header

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

  // Gambar garis vertikal untuk header (dari tableTopY sampai akhir header)
  drawVerticalLines(tableTopY, currentY - headerSubHeight);

  // Update yPos untuk mulai isi tabel (body)
  yPos = currentY - headerSubHeight - 2;

  // ------- BAGIAN BODY (Isi Tabel Test Result) -------
  if (data.testResult && data.testResult.length > 0) {
    data.testResult.forEach((row: any) => {
      // Simpan posisi baris saat ini (row top)
      const rowTopY = yPos;
      // Data per kolom (8 kolom) berdasarkan urutan berikut:
      // 1. Clinical Action
      // 2. Drug
      // 3. Gene
      // 4. Genotype
      // 5. Toxicity
      // 6. Dosage
      // 7. Efficacy
      // 8. Evidence
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

      // Lakukan word wrap untuk masing-masing kolom
      const wrappedLinesPerCol: string[][] = rowValues.map((val) =>
        wrapText(val, fontRegular, 8, colWidth - 10)
      );

      // Hitung tinggi baris (maksimum dari semua kolom dalam row)
      let maxRowHeight = 0;
      wrappedLinesPerCol.forEach((lines) => {
        const colHeight = lines.length * 10;
        if (colHeight > maxRowHeight) maxRowHeight = colHeight;
      });

      // Pastikan cukup ruang untuk baris ini
      ensureSpace(maxRowHeight + 5);

      // Gambar teks di setiap kolom
      for (let i = 0; i < tableColCount; i++) {
        let tempY = yPos;
        wrappedLinesPerCol[i].forEach((line) => {
          page.drawText(line, {
            x: leftMargin + i * colWidth + 5,
            y: tempY,
            size: 8,
            font: fontRegular,
            color: rgb(0, 0, 0),
          });
          tempY -= 10;
        });
      }

      // Tentukan batas bawah row
      const rowBottomY = yPos - maxRowHeight - 5;

      // Gambar garis horizontal di bawah row tersebut
      drawHorizontalLine(rowBottomY);

      // Gambar garis vertikal pada row (dari rowTopY ke rowBottomY)
      drawVerticalLines(rowTopY, rowBottomY);

      // Update yPos untuk row selanjutnya
      yPos = rowBottomY;
    });
  }

  // Tambahkan space setelah tabel test result
  yPos -= 20;

  // GENE FUNCTION Title
  ensureSpace(40);
  const geneFunctionTitle = "GENE FUNCTION";
  page.drawRectangle({
    x: leftMargin,
    y: yPos - 5,
    width: pageWidth - 2 * leftMargin,
    height: 25,
    color: blueColor,
  });
  page.drawText(geneFunctionTitle, {
    x: leftMargin + 5,
    y: yPos,
    size: 12,
    font: fontBold,
    color: rgb(1, 1, 1),
  });
  yPos -= 30;

  // Tampilkan setiap gene function
  if (data.geneFunction && data.geneFunction.length > 0) {
    data.geneFunction.forEach((gene: any) => {
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

  // --- Footer (opsional) ---
  ensureSpace(30);
  const footerText = data.footerText || "This is an example of footer text.";
  const footerFontSize = 7;
  const wrappedFooter = wrapText(
    footerText,
    fontRegular,
    footerFontSize,
    pageWidth - leftMargin * 2
  );
  wrappedFooter.forEach((line) => {
    ensureSpace(10);
    page.drawText(line, {
      x: leftMargin,
      y: yPos,
      size: footerFontSize,
      font: fontRegular,
      color: rgb(0, 0, 0),
    });
    yPos -= 10;
  });

  // Simpan PDF dan kembalikan Blob
  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}

export default generatePDF;
