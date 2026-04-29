<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	let editingId = $state<string | null>(null);
</script>

<h1>Asukkaat</h1>

<section class="card">
	<h2>Lisää asukas</h2>
	<form method="POST" action="?/add" use:enhance>
		{#if form?.addError}
			<p class="error">{form.addError}</p>
		{/if}
		<div class="form-grid">
			<label>
				Huoneisto
				<input type="text" name="apartment" placeholder="esim. a1" required />
			</label>
			<label>
				Nimi (valinnainen)
				<input type="text" name="name" placeholder="esim. Matti Meikäläinen" />
			</label>
			<button type="submit">Lisää</button>
		</div>
	</form>
</section>

<section class="card">
	<h2>Asukasluettelo ({data.residents.length} asukasta)</h2>

	{#if data.residents.length === 0}
		<p class="muted">Ei asukkaita vielä.</p>
	{:else}
		<table>
			<thead>
				<tr>
					<th>Huoneisto</th>
					<th>Nimi</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.residents as r}
					<tr>
						{#if editingId === r.id}
							<td colspan="2">
								<form method="POST" action="?/edit" use:enhance onsubmit={() => (editingId = null)}>
									<input type="hidden" name="id" value={r.id} />
									<div class="form-grid inline">
										<input type="text" name="apartment" value={r.apartment} required />
										<input type="text" name="name" value={r.name ?? ''} placeholder="Nimi" />
										<button type="submit">Tallenna</button>
										<button type="button" class="btn-secondary" onclick={() => (editingId = null)}>Peruuta</button>
									</div>
								</form>
							</td>
						{:else}
							<td>{r.apartment}</td>
							<td>{r.name ?? '—'}</td>
						{/if}
						<td class="actions">
							{#if editingId !== r.id}
								<button class="btn-link" onclick={() => (editingId = r.id)}>Muokkaa</button>
								<form method="POST" action="?/delete" use:enhance style="display:inline">
									<input type="hidden" name="id" value={r.id} />
									<button
										type="submit"
										class="btn-link danger"
										onclick={(e) => {
											if (!confirm(`Poistetaanko asukas ${r.apartment}?`)) e.preventDefault();
										}}
									>
										Poista
									</button>
								</form>
							{/if}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	{/if}
</section>

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
		font-size: 0.875rem;
		color: #475569;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.form-grid {
		display: flex;
		gap: 0.75rem;
		align-items: flex-end;
		flex-wrap: wrap;
	}

	.form-grid.inline {
		flex-wrap: nowrap;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		font-size: 0.875rem;
		color: #475569;
		flex: 1;
		min-width: 120px;
	}

	input[type='text'] {
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
		white-space: nowrap;
		align-self: flex-end;
	}

	button[type='submit']:hover {
		background: #1d4ed8;
	}

	.btn-secondary {
		padding: 0.55rem 1rem;
		background: #f1f5f9;
		color: #475569;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.9rem;
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

	.actions {
		white-space: nowrap;
		text-align: right;
	}

	.btn-link {
		background: none;
		border: none;
		color: #2563eb;
		cursor: pointer;
		font-size: 0.875rem;
		padding: 0.2rem 0.4rem;
	}

	.btn-link.danger {
		color: #dc2626;
	}

	button[type='submit'].btn-link.danger {
		color: white;
		background-color: #dc2626;
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
