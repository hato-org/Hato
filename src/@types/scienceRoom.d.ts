interface ScienceRoom {
  date: string;
  roomTable: ScienceRoomTable[];
  createdAt?: string;
  updatedAt?: string;
}

interface ScienceRoomTable {
  name: string;
  table: string[];
}
