interface ReportSchema {
  type?: ReportType;
  title: string;
  description: string;
  fields?: ReportField[];
  url: string;
}

type ReportType = 'error' | 'spam' | 'inaccurate' | 'other';

interface ReportField {
  name: string;
  value: string;
}
