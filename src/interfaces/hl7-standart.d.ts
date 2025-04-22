declare module "hl7-standard" {
  export default class HL7 {
    constructor(message: string, options?: { lineEndings?: string });

    createSegment(segmentName: string): HL7Segment;
    build(): string;
  }

  export class HL7Segment {
    setField(fieldIndex: number, value: string): HL7Segment;
  }
}
