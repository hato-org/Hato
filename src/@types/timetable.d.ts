interface Subject {
	name: string;
	description: string;
}

interface CurrentTimetable {
	now?: Subject;
	past: Subject[];
	next: Subject[];
	period: number;
	week: 'A' | 'B';
}