<script lang="ts">
	import { enhance } from '$app/forms';
	import { DAY_NAMES } from '$lib/utils.js';

	let { data, form } = $props();

	const a = $derived(data.allocation);
	const canEdit = $derived(a.status === 'draft');

	const days = [1, 2, 3, 4, 5, 6, 7];

	// Group slots by day
	const byDay = $derived(
		days
			.map((d) => ({
				day: d,
				name: DAY_NAMES[d],
				slots: data.slots.filter((s) => s.day_of_week === d)
			}))
			.filter((g) => g.slots.length > 0)
	);
</script>

<div class="header">
	<div>
		<a href="/admin/allocations/{a.id}" class="back">← {a.name}</a>
		<h1>Vuorot</h1>
	</div>
</div>

{#if canEdit}
	<section class="card">
		<h2>Lisää vuoro</h2>
		<form method="POST" action="?/add" use:enhance>
			{#if form?.addError}
				<p class="error">{form.addError}</p>
			{/if}
			<div class="form-row">
				<label>
					Viikonpäivä
					<select name="day_of_week" required>
						<option value="">Valitse…</option>
						{#each days as d}
							<option value={d}>{DAY_NAMES[d]}</option>
						{/each}
					</select>
				</label>
				<label>
					Alkaa
					<input type="time" name="start_time" required />
				</label>
				<label>
					Loppuu
					<input type="time" name="end_time" required />
				</label>
				<button type="submit">Lisää vuoro</button>
			</div>
		</form>
	</section>
{/if}

<section class="card">
	<h2>Määritellyt vuorot ({data.slots.length})</h2>

	{#if data.slots.length === 0}
		<p class="muted">Ei vuoroja vielä.</p>
	{:else}
		{#each byDay as group}
			<div class="day-group">
				<h3>{group.name}</h3>
				<ul class="slot-list">
					{#each group.slots as slot}
						<li class="slot-row">
							<span>{slot.start_time}–{slot.end_time}</span>
							{#if canEdit}
								<form method="POST" action="?/remove" use:enhance style="display:inline">
									<input type="hidden" name="id" value={slot.id} />
									<button
										type="submit"
										class="btn-remove"
										onclick={(e) => {
											if (!confirm('Poistetaanko vuoro?')) e.preventDefault();
										}}
									>
										Poista
									</button>
								</form>
							{/if}
						</li>
					{/each}
				</ul>
			</div>
		{/each}
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
		margin: 0 0 1rem;
		font-size: 0.875rem;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	h3 {
		margin: 0 0 0.5rem;
		font-size: 1rem;
		color: #334155;
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
	}

	select,
	input[type='time'] {
		padding: 0.55rem 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 0.95rem;
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

	.day-group {
		margin-bottom: 1.25rem;
	}

	.slot-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.slot-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.5rem 0.75rem;
		background: #f8fafc;
		border-radius: 6px;
		font-size: 0.95rem;
		max-width: 300px;
	}

	.btn-remove {
		background: none;
		border: none;
		color: #dc2626;
		cursor: pointer;
		font-size: 0.85rem;
		padding: 0.1rem 0.3rem;
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
