<script lang="ts">
	import { enhance } from '$app/forms';
	import { DAY_NAMES } from '$lib/utils.js';

	let { data, form } = $props();

	const a = $derived(data.allocation);
	const canEdit = $derived(a.status !== 'published');

	// Slots already locked (as a set of slot IDs)
	const lockedSlotIds = $derived(new Set(data.locked.map((l) => l.slot_id)));
	const availableSlots = $derived(data.slots.filter((s) => !lockedSlotIds.has(s.id)));
</script>

<div class="header">
	<div>
		<a href="/admin/allocations/{a.id}" class="back">← {a.name}</a>
		<h1>Lukitut varaukset</h1>
	</div>
</div>

{#if canEdit}
	<section class="card">
		<h2>Lisää lukittu varaus</h2>
		<p class="hint">Lukittu varaus esivaraa vuoron tietylle asukkaalle ennen optimointia.</p>
		<form method="POST" action="?/add" use:enhance>
			{#if form?.addError}
				<p class="error">{form.addError}</p>
			{/if}
			<div class="form-row">
				<label>
					Vuoro
					<select name="slot_id" required>
						<option value="">Valitse vuoro…</option>
						{#each availableSlots as s}
							<option value={s.id}>{DAY_NAMES[s.day_of_week]} {s.start_time}–{s.end_time}</option>
						{/each}
					</select>
				</label>
				<label>
					Asukas
					<select name="resident_id" required>
						<option value="">Valitse asukas…</option>
						{#each data.residents as r}
							<option value={r.resident_id}>{r.apartment}{r.name ? ` – ${r.name}` : ''}</option>
						{/each}
					</select>
				</label>
				<button type="submit">Lukitse</button>
			</div>
		</form>
	</section>
{/if}

<section class="card">
	<h2>Lukitut varaukset ({data.locked.length})</h2>

	{#if data.locked.length === 0}
		<p class="muted">Ei lukittuja varauksia.</p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>Vuoro</th>
					<th>Asukas</th>
					{#if canEdit}<th></th>{/if}
				</tr>
			</thead>
			<tbody>
				{#each data.locked as lock}
					<tr>
						<td>{DAY_NAMES[lock.day_of_week]} {lock.start_time}–{lock.end_time}</td>
						<td>{lock.apartment}</td>
						{#if canEdit}
							<td>
								<form method="POST" action="?/remove" use:enhance style="display:inline">
									<input type="hidden" name="id" value={lock.id} />
									<button type="submit" class="btn-remove">Poista</button>
								</form>
							</td>
						{/if}
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>

<style>
	.header {
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
		margin: 0;
		font-size: 1.4rem;
	}

	.card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		margin-bottom: 1.5rem;
	}

	h2 {
		margin: 0 0 0.75rem;
		font-size: 0.875rem;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.hint {
		font-size: 0.875rem;
		color: #64748b;
		margin: 0 0 1rem;
	}

	.form-row {
		display: flex;
		gap: 0.75rem;
		align-items: flex-end;
		flex-wrap: wrap;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.875rem;
		color: #475569;
		flex: 1;
		min-width: 200px;
	}

	select {
		padding: 0.55rem 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 0.9rem;
	}

	button[type='submit'] {
		padding: 0.55rem 1.1rem;
		background: #2563eb;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.95rem;
		align-self: flex-end;
	}

	button[type='submit']:hover {
		background: #1d4ed8;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
	}

	th {
		text-align: left;
		padding: 0.5rem 0.75rem;
		border-bottom: 2px solid #e2e8f0;
		color: #64748b;
		font-weight: 600;
	}

	td {
		padding: 0.6rem 0.75rem;
		border-bottom: 1px solid #f1f5f9;
	}

	.btn-remove {
		background: none;
		border: none;
		color: #dc2626;
		cursor: pointer;
		font-size: 0.875rem;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin: 0 0 0.75rem;
	}

	.muted {
		color: #94a3b8;
	}
</style>
