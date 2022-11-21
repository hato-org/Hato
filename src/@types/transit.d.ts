interface TransitInfo {
  leaveAt: string;
  destination: string;
}

interface Transit {
  ueda: TransitInfo[];
  nagano: TransitInfo[];
}
