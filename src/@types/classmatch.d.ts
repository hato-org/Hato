type ClassmatchSeason = 'spring' | 'autumn';

type ClassmatchSportId =
  | 'futsal'
  | 'volleyball'
  | 'volleyballf'
  | 'softball'
  | 'tennis'
  | 'tabletennis';

interface ClassmatchSport {
  id: ClassmatchSportId;
  name: string;
}

type ClassmatchSportInfo = ClassmatchSport & {
  map: string;
  tournament: ClassmatchTournament;
};

type ClassmatchTournament =
  | {
      id: string;
      participants:
        | [ClassmatchParticipant, ClassmatchParticipant]
        | ([] & Array<ClassmatchParticipant>); // https://github.com/microsoft/TypeScript/issues/38514#issuecomment-639866438
      match: [ClassmatchTournament, ClassmatchTournament];
      class?: never;
      meta: ClassmatchTournamentMeta;
      editHistory?: ClassmatchTournamentEditHistory[];
    }
  | {
      id: string;
      participants:
        | [ClassmatchParticipant, ClassmatchParticipant]
        | ([] & Array<ClassmatchParticipant>);
      match?: never;
      class: ClassmatchClass;
      meta: ClassmatchTournamentMeta;
      editHistory?: ClassmatchTournamentEditHistory[];
    };

interface ClassmatchClass {
  type: Type;
  grade: string;
  class: string;
}

interface ClassmatchParticipant extends ClassmatchClass {
  from: string;
  point: number;
}

interface ClassmatchTournamentMeta {
  location: string | null;
  startAt: string | null;
  endAt: string | null;
}

interface ClassmatchTournamentUpcoming
  extends ClassmatchTournamentMeta,
    ClassmatchSport {
  matchId: string;
}

interface ClassmatchLiveStream {
  type: 'youtube' | 'instagram';
  name: string;
  url: string;
}

interface ClassmatchTournamentEditHistory {
  userId: string;
  date: string;
}
