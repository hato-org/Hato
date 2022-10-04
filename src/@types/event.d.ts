interface Event {
  _id: string;
  title: string;
  description?: string;
  startAt: Date;
  endAt: Date;
  isAllDay: boolean;
  tags: Tag[];
  location?: string;
  url?: string;
  // grade: number[];
  // class: number[];
  // course?: Course[];
  owner: string;
  external?: boolean;
  source?: {
    name: string;
    url?: string;
  };
}

interface Tag {
  label: string;
  value: string;
  color: string;
}
