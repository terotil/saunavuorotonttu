export interface SlotInput {
	id: string;
	day_of_week: number;
	start_time: string;
	end_time: string;
}

export interface ResidentInput {
	id: string;
	apartment: string;
	priority: number; // from resident_priority.rank (1 = highest priority)
}

export interface PreferenceInput {
	resident_id: string;
	slots_requested: number;
	ranked_slot_ids: string[]; // index 0 = most preferred (rank 1)
}

export interface LockedInput {
	slot_id: string;
	resident_id: string;
}

export interface AssignmentOutput {
	slot_id: string;
	resident_id: string;
	is_locked: boolean;
}

export function runOptimization(
	slots: SlotInput[],
	residents: ResidentInput[],
	preferences: PreferenceInput[],
	locked: LockedInput[]
): { assignments: AssignmentOutput[]; warnings: string[] } {
	const warnings: string[] = [];
	const assignments: AssignmentOutput[] = [];
	const occupiedSlots = new Set<string>();
	const residentSlots = new Map<string, string[]>(); // residentId -> assigned slotIds

	const slotById = new Map(slots.map((s) => [s.id, s]));
	const prefByResident = new Map(preferences.map((p) => [p.resident_id, p]));

	// Step 1: Apply locked reservations
	for (const lock of locked) {
		occupiedSlots.add(lock.slot_id);
		assignments.push({ slot_id: lock.slot_id, resident_id: lock.resident_id, is_locked: true });
		const current = residentSlots.get(lock.resident_id) ?? [];
		current.push(lock.slot_id);
		residentSlots.set(lock.resident_id, current);
	}

	// Step 2: Sort residents by priority (1=highest), tiebreak alphabetically by apartment
	const sortedResidents = [...residents].sort((a, b) => {
		if (a.priority !== b.priority) return a.priority - b.priority;
		return a.apartment.localeCompare(b.apartment, 'fi');
	});

	// Step 3: Pass 1 — mandatory first slot for every resident who submitted preferences
	for (const resident of sortedResidents) {
		const pref = prefByResident.get(resident.id);
		if (!pref) continue; // no preferences submitted, skip

		const currentSlots = residentSlots.get(resident.id) ?? [];
		if (currentSlots.length >= 1) continue; // already has a slot (from lock)

		let assigned = false;
		for (const slotId of pref.ranked_slot_ids) {
			if (!occupiedSlots.has(slotId)) {
				occupiedSlots.add(slotId);
				residentSlots.set(resident.id, [slotId]);
				assignments.push({ slot_id: slotId, resident_id: resident.id, is_locked: false });
				assigned = true;
				break;
			}
		}
		if (!assigned) {
			warnings.push(`Huoneisto ${resident.apartment}: ei vapaita toivottuja vuoroja`);
		}
	}

	// Step 4: Pass 2 — second slot for residents who requested 2
	for (const resident of sortedResidents) {
		const pref = prefByResident.get(resident.id);
		if (!pref || pref.slots_requested < 2) continue;

		const currentSlots = residentSlots.get(resident.id) ?? [];
		if (currentSlots.length >= 2) continue;
		if (currentSlots.length === 0) continue; // didn't get first slot, skip

		// Candidates in preference rank order, excluding already-occupied
		const rankedAvailable = pref.ranked_slot_ids.filter((id) => !occupiedSlots.has(id) && slotById.has(id));

		if (rankedAvailable.length === 0) {
			warnings.push(`Huoneisto ${resident.apartment}: ei vapaita vuoroja toiselle vuorolle`);
			continue;
		}

		// Score: primary = preference rank (position in rankedAvailable), secondary = gap cost
		const scored = rankedAvailable.map((slotId, rankIndex) => {
			const slot = slotById.get(slotId)!;
			return { slotId, rankIndex, gapCost: computeGapCost(slot, assignments, slots) };
		});

		// Sort by rank first, then gap cost as tiebreaker
		scored.sort((a, b) => {
			if (a.rankIndex !== b.rankIndex) return a.rankIndex - b.rankIndex;
			return a.gapCost - b.gapCost;
		});

		const chosen = scored[0];
		occupiedSlots.add(chosen.slotId);
		residentSlots.set(resident.id, [...currentSlots, chosen.slotId]);
		assignments.push({ slot_id: chosen.slotId, resident_id: resident.id, is_locked: false });
	}

	return { assignments, warnings };
}

/**
 * Compute gap cost for placing a candidate slot on its day.
 * Gap = number of unassigned slots between the first and last assigned slot on that day
 * (including the candidate). Lower is better; 0 means no gaps.
 */
function computeGapCost(candidate: SlotInput, currentAssignments: AssignmentOutput[], allSlots: SlotInput[]): number {
	const daySlots = allSlots
		.filter((s) => s.day_of_week === candidate.day_of_week)
		.sort((a, b) => a.start_time.localeCompare(b.start_time));

	if (daySlots.length <= 1) return 0;

	const assignedOnDay = new Set(
		currentAssignments
			.map((a) => a.slot_id)
			.filter((id) => {
				const s = allSlots.find((sl) => sl.id === id);
				return s?.day_of_week === candidate.day_of_week;
			})
	);
	assignedOnDay.add(candidate.id);

	const assignedIndices = daySlots.map((s, i) => ({ id: s.id, i })).filter(({ id }) => assignedOnDay.has(id));

	if (assignedIndices.length <= 1) return 0;

	const minIdx = Math.min(...assignedIndices.map(({ i }) => i));
	const maxIdx = Math.max(...assignedIndices.map(({ i }) => i));

	let gaps = 0;
	for (let i = minIdx; i <= maxIdx; i++) {
		if (!assignedOnDay.has(daySlots[i].id)) gaps++;
	}
	return gaps;
}
