interface Status {
  status: StatusServerInfo[];
  updatedAt: string;
}

interface StatusServer {
  id: string;
  name: string;
  url: string;
}

interface StatusServerInfo extends StatusServer {
  ok: boolean;
  status: number;
  statusText: string;
  body: string;
}

interface StatusMaintenance {
  type: 'maintenance';
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  scope: StatusServer['id'][];
}

interface StatusHistory {
  id: string;
  name: string;
  status: number;
  statusText: string;
  ok: boolean;
  responseTime: number;
  timestamp: number;
}
