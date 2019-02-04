export interface ReverseRestUrlSegment {
  type: 'host' | 'variable' | 'path';
  segmentValue: string;
}
