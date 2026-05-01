<script lang="ts">
	import { enhance } from '$app/forms';
	import { DAY_NAMES } from '$lib/utils.js';
	import type { Slot } from '$lib/db/types.js';

	let { data, form } = $props();

	let selected = $state<string[]>([]);
	let slotsRequested = $state<number>(1);

	$effect(() => {
		selected = data.existing?.slots.map((s) => s.slot_id) ?? [];
		slotsRequested = data.existing?.preference.slots_requested ?? 1;
	});

	const unselected = $derived(data.slots.filter((s) => !selected.includes(s.id)));
	const slotById = $derived(new Map(data.slots.map((s: Slot) => [s.id, s])));

	function addSlot(slotId: string) {
		if (!selected.includes(slotId)) selected = [...selected, slotId];
	}

	function removeSlot(slotId: string) {
		selected = selected.filter((id) => id !== slotId);
	}

	function moveUp(i: number) {
		if (i === 0) return;
		const arr = [...selected];
		[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
		selected = arr;
	}

	function moveDown(i: number) {
		if (i === selected.length - 1) return;
		const arr = [...selected];
		[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
		selected = arr;
	}

	function slotLabel(s: Slot) {
		return `${DAY_NAMES[s.day_of_week]} ${s.start_time}–${s.end_time}`;
	}

	const unselectedByDay = $derived(
		[1, 2, 3, 4, 5, 6, 7]
			.map((d) => ({
				day: d,
				name: DAY_NAMES[d],
				slots: unselected.filter((s) => s.day_of_week === d)
			}))
			.filter((g) => g.slots.length > 0)
	);
</script>

<div class="page">
	<header>
		<a href="/" class="back">← Etusivu</a>
		<h1>Saunavuorotoiveet</h1>
		<p class="resident-badge">Huoneisto {data.resident.apartment}</p>
	</header>

	{#if data.allocation.status !== 'open'}
		<div class="notice">
			<p>Toiveiden syöttö ei ole tällä hetkellä auki. Tarkista myöhemmin uudelleen.</p>
		</div>
	{:else}
		<div class="columns">
			<section class="panel">
				<h2>Saatavilla olevat vuorot</h2>
				<p class="hint">Klikkaa vuoroa lisätäksesi sen toivelistallesi.</p>

				{#if unselectedByDay.length === 0}
					<p class="muted">Kaikki vuorot on lisätty toivelistalle.</p>
				{:else}
					{#each unselectedByDay as group}
						<div class="day-group">
							<h3>{group.name}</h3>
							{#each group.slots as s}
								<button type="button" class="slot-btn" onclick={() => addSlot(s.id)}>
									{s.start_time}–{s.end_time} +
								</button>
							{/each}
						</div>
					{/each}
				{/if}
			</section>

			<section class="panel">
				<h2>Toivelista ({selected.length} vuoroa)</h2>
				<p class="hint">Järjestä vuorot mieluisuusjärjestykseen. Ensimmäinen = paras.</p>

				<form method="POST" action="?/save" use:enhance={() => async ({ update }) => update({ reset: false })}>
					{#if form?.error}
						<p class="error">{form.error}</p>
					{/if}

					{#if form?.saved}
						<p class="success">Toiveet tallennettu!</p>
					{/if}

					<div class="slots-count">
						<label>
							Kuinka monta vuoroa haluat?
							<div class="radio-group">
								<label class="radio-label">
									<input type="radio" name="slots_requested" value={1} bind:group={slotsRequested} />
									1 vuoro
								</label>
								<label class="radio-label">
									<input type="radio" name="slots_requested" value={2} bind:group={slotsRequested} />
									2 vuoroa
								</label>
							</div>
						</label>
					</div>

					{#if selected.length === 0}
						<p class="muted empty">Lisää vuoroja toivelistallesi.</p>
					{:else}
						<ol class="ordered-list">
							{#each selected as slotId, i}
								{@const s = slotById.get(slotId)}
								<input type="hidden" name="slot_ids" value={slotId} />
								<li class="ordered-item">
									<span class="rank">#{i + 1}</span>
									<span class="label">{s ? slotLabel(s) : slotId}</span>
									<div class="item-actions">
										<button type="button" class="move-btn" onclick={() => moveUp(i)} disabled={i === 0}>↑</button>
										<button type="button" class="move-btn" onclick={() => moveDown(i)} disabled={i === selected.length - 1}>↓</button>
										<button type="button" class="remove-btn" onclick={() => removeSlot(slotId)}>✕</button>
									</div>
								</li>
							{/each}
						</ol>
					{/if}

					<button type="submit" class="btn-submit" disabled={selected.length === 0}>
						Tallenna toiveet
					</button>
				</form>
			</section>
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 900px;
		margin: 0 auto;
		padding: 1.5rem 1rem;
	}

	header {
		margin-bottom: 1.5rem;
	}

	.back {
		font-size: 0.85rem;
		color: #64748b;
		text-decoration: none;
		display: block;
		margin-bottom: 0.4rem;
	}

	h1 {
		margin: 0 0 0.4rem;
		font-size: 1.6rem;
	}

	.resident-badge {
		display: inline-block;
		background: #dbeafe;
		color: #1d4ed8;
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		margin: 0;
	}

	.notice {
		background: #fef3c7;
		border: 1px solid #fde047;
		border-radius: 8px;
		padding: 1.25rem 1.5rem;
		color: #854d0e;
	}

	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		align-items: start;
	}

	@media (max-width: 640px) {
		.columns {
			grid-template-columns: 1fr;
		}
	}

	.panel {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.25rem;
	}

	h2 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
		color: #1e293b;
	}

	h3 {
		margin: 0.75rem 0 0.35rem;
		font-size: 0.85rem;
		font-weight: 600;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hint {
		font-size: 0.825rem;
		color: #94a3b8;
		margin: 0 0 1rem;
	}

	.day-group {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		margin-bottom: 0.5rem;
	}

	.slot-btn {
		text-align: left;
		padding: 0.5rem 0.75rem;
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
		color: #334155;
		transition: background 0.1s;
	}

	.slot-btn:hover {
		background: #dbeafe;
		border-color: #93c5fd;
	}

	.slots-count {
		margin-bottom: 1rem;
	}

	.slots-count label {
		font-size: 0.9rem;
		color: #475569;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.radio-group {
		display: flex;
		gap: 1rem;
	}

	.radio-label {
		display: flex;
		align-items: center;
		gap: 0.35rem;
		font-size: 0.95rem;
		color: #1e293b;
		cursor: pointer;
	}

	.ordered-list {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.ordered-item {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.5rem 0.6rem;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 6px;
		font-size: 0.9rem;
	}

	.rank {
		font-weight: 700;
		color: #16a34a;
		min-width: 2rem;
	}

	.label {
		flex: 1;
		color: #1e293b;
	}

	.item-actions {
		display: flex;
		gap: 0.2rem;
	}

	.move-btn {
		padding: 0.15rem 0.4rem;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.8rem;
		color: #475569;
	}

	.move-btn:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.remove-btn {
		padding: 0.15rem 0.4rem;
		background: none;
		border: none;
		cursor: pointer;
		color: #94a3b8;
		font-size: 0.85rem;
	}

	.remove-btn:hover {
		color: #dc2626;
	}

	.btn-submit {
		width: 100%;
		padding: 0.75rem;
		background: #2563eb;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		font-weight: 600;
	}

	.btn-submit:hover:not(:disabled) {
		background: #1d4ed8;
	}

	.btn-submit:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin: 0 0 0.75rem;
	}

	.success {
		color: #16a34a;
		font-size: 0.875rem;
		background: #f0fdf4;
		border: 1px solid #bbf7d0;
		border-radius: 6px;
		padding: 0.5rem 0.75rem;
		margin: 0 0 0.75rem;
	}

	.empty {
		font-size: 0.875rem;
		margin: 0 0 1rem;
	}

	.muted {
		color: #94a3b8;
		font-size: 0.875rem;
	}
</style>
