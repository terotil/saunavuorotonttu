export const DAY_NAMES: Record<number, string> = {
	1: 'Maanantai',
	2: 'Tiistai',
	3: 'Keskiviikko',
	4: 'Torstai',
	5: 'Perjantai',
	6: 'Lauantai',
	7: 'Sunnuntai'
};

export const STATUS_LABELS: Record<string, string> = {
	draft: 'Luonnos',
	open: 'Auki',
	closed: 'Suljettu',
	optimized: 'Optimoitu',
	published: 'Julkaistu'
};

export function formatSlotTime(startTime: string, endTime: string): string {
	return `${startTime}–${endTime}`;
}

export function formatSlot(dayOfWeek: number, startTime: string, endTime: string): string {
	return `${DAY_NAMES[dayOfWeek]} ${startTime}–${endTime}`;
}
