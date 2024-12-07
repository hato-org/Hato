interface TransitInfo {
  leaveAt: string;
  destination: string;
}

interface Transit {
  ueda: TransitInfo[];
  nagano: TransitInfo[];
}

interface DiaInfo {
  lineInfo: {
    name: string;
    kana: string;
  };
  status: {
    code: 'suspend' | 'trouble' | 'normal';
    text: string;
  };
  description: string;
  updatedAt: string;
}

interface TransitTimetable {
  starting: string;
  destination: string;
  stations: TransitTimetableStation[];
}

interface TransitTimetableStation {
  name: string;
  arriveAt?: string;
  departAt?: string;
}