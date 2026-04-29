<script lang="ts">
	import { enhance } from '$app/forms';
	import { STATUS_LABELS } from '$lib/utils.js';

	let { data, form } = $props();

	const statusClass: Record<string, string> = {
		draft: 'badge-gray',
		open: 'badge-blue',
		closed: 'badge-amber',
		optimized: 'badge-purple',
		published: 'badge-green'
	};
</script>

<h1>Varausjaksot</h1>

<section class="card">
	<h2>Luo uusi varausjakso</h2>
	<form method="POST" action="?/create" use:enhance>
		{#if form?.createError}
			<p class="error">{form.createError}</p>
		{/if}
		<div class="form-row">
			<input type="text" name="name" placeholder="esim. Kevät 2026" required />
			<button type="submit">Luo jakso</button>
		</div>
	</form>
</section>

{#if data.allocations.length > 0}
	<section class="card">
		<h2>Aiemmat jaksot</h2>
		<table>
			<thead>
				<tr>
					<th>Nimi</th>
					<th>Tila</th>
					<th>Luotu</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.allocations as a}
					<tr>
						<td>{a.name}</td>
						<td><span class="badge {statusClass[a.status]}">{STATUS_LABELS[a.status]}</span></td>
						<td>{new Date(a.created_at).toLocaleDateString('fi-FI')}</td>
						<td><a href="/admin/allocations/{a.id}">Avaa →</a></td>
					</tr>
				{/each}
			</tbody>
		</table>
	</section>
{:else}
	<p class="muted">Ei varausjaksoja vielä.</p>
{/if}

<style>
	h1 {
		margin: 0 0 1.5rem;
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
		font-size: 1rem;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.form-row {
		display: flex;
		gap: 0.75rem;
	}

	input[type='text'] {
		flex: 1;
		padding: 0.6rem 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 1rem;
	}

	button[type='submit'] {
		padding: 0.6rem 1.25rem;
		background: #2563eb;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.95rem;
		white-space: nowrap;
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
		padding: 0.65rem 0.75rem;
		border-bottom: 1px solid #f1f5f9;
	}

	td a {
		color: #2563eb;
		text-decoration: none;
		font-weight: 500;
	}

	.badge {
		display: inline-block;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		font-size: 0.8rem;
		font-weight: 600;
	}

	:global(.badge-gray) {
		background: #f1f5f9;
		color: #475569;
	}
	:global(.badge-blue) {
		background: #dbeafe;
		color: #1d4ed8;
	}
	:global(.badge-amber) {
		background: #fef3c7;
		color: #b45309;
	}
	:global(.badge-purple) {
		background: #ede9fe;
		color: #6d28d9;
	}
	:global(.badge-green) {
		background: #dcfce7;
		color: #15803d;
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
