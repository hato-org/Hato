interface TransitInfo {
  leaveAt: Date;
  destination: string;
}

interface Transit {
  ueda: TransitInfo[];
  nagano: TransitInfo[];
}
