interface Report {
  type?: ReportType;
  title: string;
  description: string;
  fields?: ReportField[];
  url: string;
}

type ReportType = 'spam' | 'inaccurate' | 'other';

interface ReportField {
  name: string;
  value: string;
}
