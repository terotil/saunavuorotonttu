<script lang="ts">
	import { enhance } from '$app/forms';
	import { DAY_NAMES } from '$lib/utils.js';

	let { data } = $props();

	const a = $derived(data.allocation);

	const days = [1, 2, 3, 4, 5, 6, 7];

	const byDay = $derived(
		days
			.map((d) => ({
				day: d,
				name: DAY_NAMES[d],
				slots: data.assignments.filter((s) => s.day_of_week === d).sort((a, b) => a.start_time.localeCompare(b.start_time))
			}))
			.filter((g) => g.slots.length > 0)
	);

	const totalAssigned = $derived(new Set(data.assignments.map((a) => a.resident_id)).size);
</script>

<div class="header">
	<div>
		<a href="/admin/allocations/{a.id}" class="back">← {a.name}</a>
		<h1>Tulokset</h1>
	</div>
	{#if a.status === 'optimized'}
		<form method="POST" action="/admin/allocations/{a.id}?/publish" use:enhance>
			<button
				type="submit"
				class="btn-publish"
				onclick={(e) => {
					if (!confirm('Julkaistaanko varaukset? Asukkaat näkevät tulokset.')) e.preventDefault();
				}}
			>
				Julkaise
			</button>
		</form>
	{/if}
</div>

{#if data.warnings.length > 0}
	<div class="warnings-card">
		<h2>⚠ Varoitukset ({data.warnings.length})</h2>
		<ul>
			{#each data.warnings as w}
				<li>{w}</li>
			{/each}
		</ul>
	</div>
{/if}

<div class="summary">
	<span>{data.assignments.length} varaukset yhteensä</span>
	<span>{totalAssigned} asukkaalle</span>
</div>

{#if data.assignments.length === 0}
	<p class="muted">Ei varauksia. Aja optimointi ensin.</p>
{:else}
	{#each byDay as group}
		<section class="day-section">
			<h2>{group.name}</h2>
			<table>
				<thead>
					<tr>
						<th>Aika</th>
						<th>Huoneisto</th>
						<th>Tyyppi</th>
					</tr>
				</thead>
				<tbody>
					{#each group.slots as s}
						{#if s.apartment}
						<tr class={s.is_locked ? 'locked-row' : ''}>
							<td>{s.start_time}–{s.end_time}</td>
							<td>{s.apartment}</td>
							<td>{s.is_locked ? '🔒 lukittu' : 'optimoitu'}</td>
						</tr>
						{:else}
						<tr class="unbooked-row">
							<td>{s.start_time}–{s.end_time}</td>
							<td>&mdash;</td>
							<td>vapaa</td>
						</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</section>
	{/each}
{/if}

<style>
	.header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		margin-bottom: 1.5rem;
		gap: 1rem;
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

	.btn-publish {
		padding: 0.65rem 1.5rem;
		background: #16a34a;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.95rem;
	}

	.btn-publish:hover {
		background: #15803d;
	}

	.warnings-card {
		background: #fefce8;
		border: 1px solid #fde047;
		border-radius: 8px;
		padding: 1rem 1.5rem;
		margin-bottom: 1.5rem;
	}

	.warnings-card h2 {
		margin: 0 0 0.5rem;
		font-size: 0.95rem;
		color: #854d0e;
	}

	.warnings-card ul {
		margin: 0;
		padding-left: 1.25rem;
		font-size: 0.875rem;
		color: #713f12;
	}

	.summary {
		display: flex;
		gap: 1.5rem;
		margin-bottom: 1.5rem;
		font-size: 0.875rem;
		color: #64748b;
	}

	.day-section {
		margin-bottom: 1.5rem;
	}

	h2 {
		font-size: 1.1rem;
		margin: 0 0 0.5rem;
		color: #334155;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.95rem;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		overflow: hidden;
	}

	th {
		text-align: left;
		padding: 0.5rem 0.75rem;
		background: #f8fafc;
		border-bottom: 2px solid #e2e8f0;
		color: #64748b;
		font-weight: 600;
	}

	td {
		padding: 0.6rem 0.75rem;
		border-bottom: 1px solid #f1f5f9;
	}

	tr:last-child td {
		border-bottom: none;
	}

	.locked-row td {
		background: #fef9c3;
	}

	.muted, .unbooked-row {
		color: #94a3b8;
	}
</style>
