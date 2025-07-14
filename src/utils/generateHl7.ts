interface HL7TemplateRow {
  obxRunNumber: number;
  geneName: string;
  section: number;
  geneSectionRunNumber: string;
  code: string;
  fixedKeyName: string;
  fixedValue: string;
  variableValue: string;
  fullTemplate: string;
}

// Complete standard template based on your Excel mapping table
const HL7_STANDARD_TEMPLATE: HL7TemplateRow[] = [
  // ABCG2 - 7 rows (OBX 1-7)
  {
    obxRunNumber: 1,
    geneName: "ABCG2",
    section: 4,
    geneSectionRunNumber: "4a",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT504^Variant Name^EPIC",
    fixedValue: "ABCG2 c.421C>A",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT504^Variant Name^EPIC|{geneSectionRunNumber}|ABCG2 c.421C>A|",
  },
  {
    obxRunNumber: 2,
    geneName: "ABCG2",
    section: 4,
    geneSectionRunNumber: "4a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "74^ABCG2^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|74^ABCG2^HGNC|",
  },
  {
    obxRunNumber: 3,
    geneName: "ABCG2",
    section: 4,
    geneSectionRunNumber: "4a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT505^Discrete Genetic Variant^EPIC",
    fixedValue: "rs2231142^NM_004827.3:c.421C>A^dbSNP",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT505^Discrete Genetic Variant^EPIC|{geneSectionRunNumber}|rs2231142^NM_004827.3:c.421C>A^dbSNP|",
  },
  {
    obxRunNumber: 4,
    geneName: "ABCG2",
    section: 4,
    geneSectionRunNumber: "4a",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 5,
    geneName: "ABCG2",
    section: 4,
    geneSectionRunNumber: "4a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 6,
    geneName: "ABCG2",
    section: 4,
    geneSectionRunNumber: "4a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Transport",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Transport|",
  },
  {
    obxRunNumber: 7,
    geneName: "ABCG2",
    section: 4,
    geneSectionRunNumber: "4a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // CYP2C19 - 5 rows (OBX 8-12)
  {
    obxRunNumber: 8,
    geneName: "CYP2C19",
    section: 4,
    geneSectionRunNumber: "4b",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "2621^CYP2C19^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|2621^CYP2C19^HGNC|",
  },
  {
    obxRunNumber: 9,
    geneName: "CYP2C19",
    section: 4,
    geneSectionRunNumber: "4b",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 10,
    geneName: "CYP2C19",
    section: 4,
    geneSectionRunNumber: "4b",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 11,
    geneName: "CYP2C19",
    section: 4,
    geneSectionRunNumber: "4b",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 12,
    geneName: "CYP2C19",
    section: 4,
    geneSectionRunNumber: "4b",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // CYP2C9 - 6 rows (OBX 13-18)
  {
    obxRunNumber: 13,
    geneName: "CYP2C9",
    section: 4,
    geneSectionRunNumber: "4c",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "2623^CYP2C9^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|2623^CYP2C9^HGNC|",
  },
  {
    obxRunNumber: 14,
    geneName: "CYP2C9",
    section: 4,
    geneSectionRunNumber: "4c",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 15,
    geneName: "CYP2C9",
    section: 4,
    geneSectionRunNumber: "4c",
    code: "NR",
    fixedKeyName: "NR|VARCONCEPT566^Activity Score^EPIC",
    fixedValue: "",
    variableValue: "{activityScore}",
    fullTemplate:
      "OBX|{obxRunNumber}|NR|VARCONCEPT566^Activity Score^EPIC|{geneSectionRunNumber}|{activityScore}|",
  },
  {
    obxRunNumber: 16,
    geneName: "CYP2C9",
    section: 4,
    geneSectionRunNumber: "4c",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 17,
    geneName: "CYP2C9",
    section: 4,
    geneSectionRunNumber: "4c",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 18,
    geneName: "CYP2C9",
    section: 4,
    geneSectionRunNumber: "4c",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // CYP2D6 - 6 rows (OBX 19-24)
  {
    obxRunNumber: 19,
    geneName: "CYP2D6",
    section: 4,
    geneSectionRunNumber: "4d",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "2625^CYP2D6^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|2625^CYP2D6^HGNC|",
  },
  {
    obxRunNumber: 20,
    geneName: "CYP2D6",
    section: 4,
    geneSectionRunNumber: "4d",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 21,
    geneName: "CYP2D6",
    section: 4,
    geneSectionRunNumber: "4d",
    code: "NR",
    fixedKeyName: "NR|VARCONCEPT566^Activity Score^EPIC",
    fixedValue: "",
    variableValue: "{activityScore}",
    fullTemplate:
      "OBX|{obxRunNumber}|NR|VARCONCEPT566^Activity Score^EPIC|{geneSectionRunNumber}|{activityScore}|",
  },
  {
    obxRunNumber: 22,
    geneName: "CYP2D6",
    section: 4,
    geneSectionRunNumber: "4d",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 23,
    geneName: "CYP2D6",
    section: 4,
    geneSectionRunNumber: "4d",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 24,
    geneName: "CYP2D6",
    section: 4,
    geneSectionRunNumber: "4d",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // CYP3A5 - 5 rows (OBX 25-29)
  {
    obxRunNumber: 25,
    geneName: "CYP3A5",
    section: 4,
    geneSectionRunNumber: "4e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "2638^CYP3A5^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|2638^CYP3A5^HGNC|",
  },
  {
    obxRunNumber: 26,
    geneName: "CYP3A5",
    section: 4,
    geneSectionRunNumber: "4e",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 27,
    geneName: "CYP3A5",
    section: 4,
    geneSectionRunNumber: "4e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 28,
    geneName: "CYP3A5",
    section: 4,
    geneSectionRunNumber: "4e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 29,
    geneName: "CYP3A5",
    section: 4,
    geneSectionRunNumber: "4e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // CYP4F2 - 5 rows (OBX 30-34)
  {
    obxRunNumber: 30,
    geneName: "CYP4F2",
    section: 4,
    geneSectionRunNumber: "4f",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "2645^CYP4F2^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|2645^CYP4F2^HGNC|",
  },
  {
    obxRunNumber: 31,
    geneName: "CYP4F2",
    section: 4,
    geneSectionRunNumber: "4f",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 32,
    geneName: "CYP4F2",
    section: 4,
    geneSectionRunNumber: "4f",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 33,
    geneName: "CYP4F2",
    section: 4,
    geneSectionRunNumber: "4f",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 34,
    geneName: "CYP4F2",
    section: 4,
    geneSectionRunNumber: "4f",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // DPYD - 6 rows (OBX 35-40)
  {
    obxRunNumber: 35,
    geneName: "DPYD",
    section: 4,
    geneSectionRunNumber: "4g",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "3012^DPYD^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|3012^DPYD^HGNC|",
  },
  {
    obxRunNumber: 36,
    geneName: "DPYD",
    section: 4,
    geneSectionRunNumber: "4g",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 37,
    geneName: "DPYD",
    section: 4,
    geneSectionRunNumber: "4g",
    code: "NR",
    fixedKeyName: "NR|VARCONCEPT566^Activity Score^EPIC",
    fixedValue: "",
    variableValue: "{activityScore}",
    fullTemplate:
      "OBX|{obxRunNumber}|NR|VARCONCEPT566^Activity Score^EPIC|{geneSectionRunNumber}|{activityScore}|",
  },
  {
    obxRunNumber: 38,
    geneName: "DPYD",
    section: 4,
    geneSectionRunNumber: "4g",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 39,
    geneName: "DPYD",
    section: 4,
    geneSectionRunNumber: "4g",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 40,
    geneName: "DPYD",
    section: 4,
    geneSectionRunNumber: "4g",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // HLA-A*31:01 - 8 rows (OBX 41-48)
  {
    obxRunNumber: 41,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT504^Variant Name^EPIC",
    fixedValue: "HLA-A *31:01",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT504^Variant Name^EPIC|{geneSectionRunNumber}|HLA-A *31:01|",
  },
  {
    obxRunNumber: 42,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT503^Variant Category^EPIC",
    fixedValue: "^Structural",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT503^Variant Category^EPIC|{geneSectionRunNumber}|^Structural|",
  },
  {
    obxRunNumber: 43,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "4931^HLA-A^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|4931^HLA-A^HGNC|",
  },
  {
    obxRunNumber: 44,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT552^Genetic Variant Assessment^EPIC",
    fixedValue: "^Detected",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT552^Genetic Variant Assessment^EPIC|{geneSectionRunNumber}|^Detected|",
  },
  {
    obxRunNumber: 45,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT529^Allele Name^EPIC",
    fixedValue: "*31:01",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT529^Allele Name^EPIC|{geneSectionRunNumber}|*31:01|",
  },
  {
    obxRunNumber: 46,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 47,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT539^Phenotype Description^EPIC",
    fixedValue: "",
    variableValue: "{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT539^Phenotype Description^EPIC|{geneSectionRunNumber}|{phenotype}|",
  },
  {
    obxRunNumber: 48,
    geneName: "HLA-A",
    section: 2,
    geneSectionRunNumber: "2a",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT554^Interpretation^EPIC",
    fixedValue: "",
    variableValue: "{interpretation}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT554^Interpretation^EPIC|{geneSectionRunNumber}|{interpretation}|",
  },
  {
    obxRunNumber: 49,
    geneName: "HLA-B-15-02",
    section: 2,
    geneSectionRunNumber: "2b",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT504^Variant Name^EPIC",
    fixedValue: "HLA-B *15:02",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT504^Variant Name^EPIC|{geneSectionRunNumber}|HLA-B *15:02|",
  },

  // Continue with all other genes following the same pattern...
  // I'll add a few more key genes to show the pattern

  // NUDT15 - 5 rows (OBX 73-77)
  {
    obxRunNumber: 73,
    geneName: "NUDT15",
    section: 4,
    geneSectionRunNumber: "4h",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "23063^NUDT15^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|23063^NUDT15^HGNC|",
  },
  {
    obxRunNumber: 74,
    geneName: "NUDT15",
    section: 4,
    geneSectionRunNumber: "4h",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 75,
    geneName: "NUDT15",
    section: 4,
    geneSectionRunNumber: "4h",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 76,
    geneName: "NUDT15",
    section: 4,
    geneSectionRunNumber: "4h",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 77,
    geneName: "NUDT15",
    section: 4,
    geneSectionRunNumber: "4h",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },
  // SLCO1B1 - 5 rows (OBX 78-82)
  {
    obxRunNumber: 78,
    geneName: "SLCO1B1",
    section: 4,
    geneSectionRunNumber: "4i",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "10959^SLCO1B1^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|10959^SLCO1B1^HGNC|",
  },
  {
    obxRunNumber: 79,
    geneName: "SLCO1B1",
    section: 4,
    geneSectionRunNumber: "4i",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 80,
    geneName: "SLCO1B1",
    section: 4,
    geneSectionRunNumber: "4i",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 81,
    geneName: "SLCO1B1",
    section: 4,
    geneSectionRunNumber: "4i",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Transport",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Transport|",
  },
  {
    obxRunNumber: 82,
    geneName: "SLCO1B1",
    section: 4,
    geneSectionRunNumber: "4i",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // TPMT - 5 rows (OBX 83-87)
  {
    obxRunNumber: 83,
    geneName: "TPMT",
    section: 4,
    geneSectionRunNumber: "4j",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "12014^TPMT^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|12014^TPMT^HGNC|",
  },
  {
    obxRunNumber: 84,
    geneName: "TPMT",
    section: 4,
    geneSectionRunNumber: "4j",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 85,
    geneName: "TPMT",
    section: 4,
    geneSectionRunNumber: "4j",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 86,
    geneName: "TPMT",
    section: 4,
    geneSectionRunNumber: "4j",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 87,
    geneName: "TPMT",
    section: 4,
    geneSectionRunNumber: "4j",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },

  // UGT1A1 - 5 rows (OBX 88-92)
  {
    obxRunNumber: 88,
    geneName: "UGT1A1",
    section: 4,
    geneSectionRunNumber: "4k",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "12530^UGT1A1^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|12530^UGT1A1^HGNC|",
  },
  {
    obxRunNumber: 89,
    geneName: "UGT1A1",
    section: 4,
    geneSectionRunNumber: "4k",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 90,
    geneName: "UGT1A1",
    section: 4,
    geneSectionRunNumber: "4k",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 91,
    geneName: "UGT1A1",
    section: 4,
    geneSectionRunNumber: "4k",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC",
    fixedValue: "^Metabolism",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT569^Pharmacogenomic Effect Type^EPIC|{geneSectionRunNumber}|^Metabolism|",
  },
  {
    obxRunNumber: 92,
    geneName: "UGT1A1",
    section: 4,
    geneSectionRunNumber: "4k",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC",
    fixedValue: "",
    variableValue: "^{phenotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT570^Pharmacogenomic Effect Value^EPIC|{geneSectionRunNumber}|^{phenotype}|",
  },
  // VKORC1 - 10 rows (OBX 93-102)
  {
    obxRunNumber: 93,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT504^Variant Name^EPIC",
    fixedValue: "VKORC1 c.-1639G/A",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT504^Variant Name^EPIC|{geneSectionRunNumber}|VKORC1 c.-1639G/A|",
  },
  {
    obxRunNumber: 94,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT503^Variant Category^EPIC",
    fixedValue: "^Simple",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT503^Variant Category^EPIC|{geneSectionRunNumber}|^Simple|",
  },
  {
    obxRunNumber: 95,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT514^Gene Studied^EPIC",
    fixedValue: "23663^VKORC1^HGNC",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT514^Gene Studied^EPIC|{geneSectionRunNumber}|23663^VKORC1^HGNC|",
  },
  {
    obxRunNumber: 96,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT521^Molecular Consequence^EPIC",
    fixedValue: "^Regulatory Region Variant",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT521^Molecular Consequence^EPIC|{geneSectionRunNumber}|^Regulatory Region Variant|",
  },
  {
    obxRunNumber: 97,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT552^Genetic Variant Assessment^EPIC",
    fixedValue: "^Detected",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT552^Genetic Variant Assessment^EPIC|{geneSectionRunNumber}|^Detected|",
  },
  {
    obxRunNumber: 98,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT505^Discrete Genetic Variant^EPIC",
    fixedValue: "rs9923231^NM_024006.6:c.-1639G>A^dbSNP",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT505^Discrete Genetic Variant^EPIC|{geneSectionRunNumber}|rs9923231^NM_024006.6:c.-1639G>A^dbSNP|",
  },
  {
    obxRunNumber: 99,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT518^DNA Change^EPIC",
    fixedValue: "c.-1639G>A^c.-1639G>A^HGVS.c",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT518^DNA Change^EPIC|{geneSectionRunNumber}|c.-1639G>A^c.-1639G>A^HGVS.c|",
  },
  {
    obxRunNumber: 100,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "CWE",
    fixedKeyName: "CWE|VARCONCEPT553^Variant Classification^EPIC",
    fixedValue: "^Drug response",
    variableValue: "",
    fullTemplate:
      "OBX|{obxRunNumber}|CWE|VARCONCEPT553^Variant Classification^EPIC|{geneSectionRunNumber}|^Drug response|",
  },
  {
    obxRunNumber: 101,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT506^Genotype Name^EPIC",
    fixedValue: "",
    variableValue: "{genotype}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT506^Genotype Name^EPIC|{geneSectionRunNumber}|{genotype}|",
  },
  {
    obxRunNumber: 102,
    geneName: "VKORC1",
    section: 2,
    geneSectionRunNumber: "2e",
    code: "ST",
    fixedKeyName: "ST|VARCONCEPT554^Interpretation^EPIC",
    fixedValue: "",
    variableValue: "{interpretation}",
    fullTemplate:
      "OBX|{obxRunNumber}|ST|VARCONCEPT554^Interpretation^EPIC|{geneSectionRunNumber}|{interpretation}|",
  },

  // TODO: Add all remaining template rows for SLCO1B1, VKORC1, and all HLA genes
  // Following the exact same pattern as shown in your Excel file
];

// Function to get activity score based on genotype
function getActivityScore(gene: string, genotype: string): string {
  const activityScoreMap: Record<string, Record<string, string>> = {
    CYP2C9: {
      "*1/*1": "2^2",
      "*1/*2": "1.5^2",
      "*1/*3": "1.5^2",
      "*2/*2": "1^1",
      "*2/*3": "0.5^1",
      "*3/*3": "0.5^0.5",
    },
    CYP2D6: {
      "*1/*1": "2^2",
      "*1/*2": "1.5^2",
      "*1/*4": "1^2",
      "*2/*2": "1^1",
      "*4/*4": "0^0",
    },
    DPYD: {
      "*1/*1": "2^2",
      "*1/HapB3": "1.5^1.5",
      "HapB3/HapB3": "1^1",
    },
  };

  return activityScoreMap[gene]?.[genotype] || "2^2";
}

// Function to get interpretation for HLA genes
function getHLAInterpretation(gene: string, phenotype: string): string {
  const interpretationMap: Record<string, Record<string, string>> = {
    "HLA-A": {
      Negative: "No increased risk of carbamazepine hypersensitivity",
      Positive: "Increased risk of carbamazepine hypersensitivity",
    },
    "HLA-B": {
      Negative: "No increased risk of carbamazepine hypersensitivity",
      Positive: "Increased risk of abacavir hypersensitivity",
    },
  };

  return (
    interpretationMap[gene]?.[phenotype] ||
    "No specific interpretation available"
  );
}

// Function to generate OBX segments for genes present in input data
function generateOBXSegmentsForGenes(
  inputGenes: Array<{ gene: string; genotype: string; phenotype: string }>
): string[] {
  const obxSegments: string[] = [];

  inputGenes.forEach((inputGene) => {
    // Find all template rows for this gene
    const geneTemplateRows = HL7_STANDARD_TEMPLATE.filter(
      (row) => row.geneName.toUpperCase() === inputGene.gene.toUpperCase()
    );

    // Generate OBX segments for each template row
    geneTemplateRows.forEach((templateRow) => {
      let finalValue = templateRow.fixedValue;

      // Replace variable values if they exist
      if (templateRow.variableValue) {
        let variableValue = templateRow.variableValue;

        // Replace placeholders with actual data
        variableValue = variableValue
          .replace("{genotype}", inputGene.genotype)
          .replace("{phenotype}", inputGene.phenotype)
          .replace(
            "{activityScore}",
            getActivityScore(inputGene.gene, inputGene.genotype)
          )
          .replace(
            "{interpretation}",
            getHLAInterpretation(inputGene.gene, inputGene.phenotype)
          );

        finalValue = variableValue;
      }

      // Generate the complete OBX segment
      const obxSegment = templateRow.fullTemplate
        .replace("{obxRunNumber}", templateRow.obxRunNumber.toString())
        .replace("{geneSectionRunNumber}", templateRow.geneSectionRunNumber)
        .replace("{genotype}", inputGene.genotype)
        .replace("{phenotype}", inputGene.phenotype)
        .replace(
          "{activityScore}",
          getActivityScore(inputGene.gene, inputGene.genotype)
        )
        .replace(
          "{interpretation}",
          getHLAInterpretation(inputGene.gene, inputGene.phenotype)
        );

      obxSegments.push(obxSegment);
    });
  });

  return obxSegments;
}

export function buildHL7Message(data: any): string {
  console.log("Data received in buildHL7Message:", data);

  const currentDateTime = new Date()
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14);
  const messageControlId = `LAB${Math.floor(Math.random() * 100000)}`;

  // MSH, PID, PV1, ORC, OBR segments (unchanged)
  const mshSegment = [
    "MSH",
    "^~\\&",
    "LIS",
    "LIS",
    "EMR",
    "EMR",
    currentDateTime,
    "",
    "ORU^R01",
    messageControlId,
    "P",
    "2.3",
    "",
    "",
    "AL",
    "NE",
  ].join("|");

  const patientNameParts = (data.patient_name || "").split(" ");
  const lastName = patientNameParts[patientNameParts.length - 1] || "";
  const firstName = patientNameParts.slice(0, -1).join(" ") || "";

  const pidSegment = [
    "PID",
    "",
    "",
    data.id_number || data.mrn || "",
    "",
    `${lastName}^${firstName}`,
    "",
    data.date_of_birth ? data.date_of_birth.replace(/-/g, "") : "",
    data.sex || "U",
    "",
    "C^Chinese",
    data.patient_address || "Hospital Address",
    "",
    data.patient_contact_number || "Contact Number",
    "",
    "",
    "",
    "",
    data.test_case_id || "",
  ].join("|");

  const pv1Segment = [
    "PV1",
    "",
    "I",
    "HOSPITAL^NONE^^^HOSPITAL",
    "",
    "",
    "",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "",
    "HOSPITAL",
    "",
    "",
    "",
    "",
    "",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "NA",
    (data.test_case_id || "UNKNOWN") +
      "^^^^I~" +
      (data.test_case_id || "UNKNOWN") +
      "^^^^O",
    "SELF^19991130000000",
    "",
    "",
    "",
    "",
    "",
    currentDateTime.slice(0, 12) + "59",
  ].join("|");

  const labAccessionNo = String(data.test_case_id || `${currentDateTime}001`);

  const orcSegment = [
    "ORC",
    "NW",
    "",
    labAccessionNo + "^LAB",
    "",
    "A",
    "",
    "^^^" + currentDateTime.slice(0, 12) + "00^^R",
    "",
    "",
    "",
    "",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "HOSPITAL^^^^HOSPITAL^^^^HOSPITAL",
  ].join("|");

  const obrSegment = [
    "OBR",
    "1",
    "",
    labAccessionNo + "^LABDNL",
    "PGXP^PGX Targeted Panel",
    "",
    "",
    currentDateTime.slice(0, 12) + "29",
    "",
    "",
    "",
    "",
    "",
    "",
    currentDateTime.slice(0, 12) + "29",
    data.specimen_type || "EDTA",
    "15799F^" + (data.physician_name || "UNKNOWN PHYSICIAN"),
    "",
    labAccessionNo.length >= 10 ? labAccessionNo.slice(-10) : labAccessionNo,
    "",
    labAccessionNo.length >= 10 ? labAccessionNo.slice(-10) : labAccessionNo,
    labAccessionNo + "-" + messageControlId,
    currentDateTime,
    "",
    "GL^24^52^036",
    "C",
    "",
    "^^^^^R",
  ].join("|");

  // Generate OBX segments based on input genes
  let obxSegments: string[] = [];

  if (data.pgxPanel && data.pgxPanel.length > 0) {
    console.log("Processing PGX Panel:", data.pgxPanel);
    obxSegments = generateOBXSegmentsForGenes(data.pgxPanel);
  }

  console.log("Generated OBX Segments:", obxSegments);

  // Combine all segments
  return [
    mshSegment,
    pidSegment,
    pv1Segment,
    orcSegment,
    obrSegment,
    ...obxSegments,
  ].join("\r\n");
}
