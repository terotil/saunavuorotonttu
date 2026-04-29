<script lang="ts">
	import { enhance } from '$app/forms';
	import { STATUS_LABELS } from '$lib/utils.js';

	let { data } = $props();

	const a = $derived(data.allocation);

	const statusClass: Record<string, string> = {
		draft: 'badge-gray',
		open: 'badge-blue',
		closed: 'badge-amber',
		optimized: 'badge-purple',
		published: 'badge-green'
	};
</script>

<div class="header">
	<div>
		<a href="/admin" class="back">← Varausjaksot</a>
		<h1>{a.name}</h1>
	</div>
	<span class="badge {statusClass[a.status]}">{STATUS_LABELS[a.status]}</span>
</div>

<div class="nav-tabs">
	<a href="/admin/allocations/{a.id}" class="tab active">Yhteenveto</a>
	<a href="/admin/allocations/{a.id}/slots" class="tab">Vuorot</a>
	<a href="/admin/allocations/{a.id}/residents" class="tab">Asukkaat</a>
	<a href="/admin/allocations/{a.id}/locked" class="tab">Lukitut</a>
	{#if a.status === 'optimized' || a.status === 'published'}
		<a href="/admin/allocations/{a.id}/results" class="tab">Tulokset</a>
	{/if}
</div>

<div class="actions-card">
	<h2>Toiminnot</h2>

	{#if a.status === 'draft'}
		<p class="hint">Avaa jakso, jotta asukkaat voivat syöttää toiveensa.</p>
		<form method="POST" action="?/open" use:enhance>
			<button type="submit" class="btn btn-primary">Avaa toiveiden syöttö</button>
		</form>
	{:else if a.status === 'open'}
		<p class="hint">Jakso on auki. Sulje se kun kaikki toiveet on syötetty.</p>
		<form method="POST" action="?/close" use:enhance>
			<button type="submit" class="btn btn-amber">Sulje toiveiden syöttö</button>
		</form>
	{:else if a.status === 'closed'}
		<p class="hint">Toiveiden syöttö on suljettu. Voit nyt optimoida varaukset.</p>
		<form method="POST" action="?/optimize" use:enhance>
			<button type="submit" class="btn btn-primary">Optimoi varaukset</button>
		</form>
	{:else if a.status === 'optimized'}
		<p class="hint">Varaukset on optimoitu. Tarkista tulokset ennen julkaisua.</p>
		<div class="btn-row">
			<form method="POST" action="?/reopen" use:enhance>
				<button type="submit" class="btn btn-secondary">Palaa suljettuun tilaan</button>
			</form>
			<form method="POST" action="?/optimize" use:enhance>
				<button type="submit" class="btn btn-secondary">Optimoi uudelleen</button>
			</form>
			<form method="POST" action="?/publish" use:enhance>
				<button
					type="submit"
					class="btn btn-green"
					onclick={(e) => {
						if (!confirm('Julkaistaanko varaukset? Asukkaat näkevät tulokset.')) e.preventDefault();
					}}
				>
					Julkaise
				</button>
			</form>
		</div>
	{:else if a.status === 'published'}
		<p class="hint">Varaukset on julkaistu. Asukkaat näkevät tulokset.</p>
		<a href="/admin/allocations/{a.id}/results" class="btn btn-primary">Katso tulokset</a>
	{/if}
</div>

<div class="link-grid">
	<a href="/admin/allocations/{a.id}/slots" class="link-card">
		<span class="link-title">Vuorot</span>
		<span class="link-desc">Määritä käytettävissä olevat viikoittaiset vuorot</span>
	</a>
	<a href="/admin/allocations/{a.id}/residents" class="link-card">
		<span class="link-title">Asukkaat & järjestys</span>
		<span class="link-desc">Aseta asukkaiden prioriteettijärjestys</span>
	</a>
	<a href="/admin/allocations/{a.id}/locked" class="link-card">
		<span class="link-title">Lukitut varaukset</span>
		<span class="link-desc">Esivaraa vuoroja tietyille asukkaille</span>
	</a>
</div>

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
		font-size: 1.6rem;
	}

	.nav-tabs {
		display: flex;
		gap: 0.25rem;
		border-bottom: 2px solid #e2e8f0;
		margin-bottom: 1.5rem;
	}

	.tab {
		padding: 0.6rem 1rem;
		text-decoration: none;
		color: #64748b;
		font-size: 0.9rem;
		border-bottom: 2px solid transparent;
		margin-bottom: -2px;
	}

	.tab:hover,
	.tab.active {
		color: #2563eb;
		border-bottom-color: #2563eb;
	}

	.actions-card {
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
		color: #64748b;
		margin: 0 0 1rem;
		font-size: 0.9rem;
	}

	.btn {
		display: inline-block;
		padding: 0.65rem 1.25rem;
		border-radius: 6px;
		border: none;
		cursor: pointer;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.btn-primary {
		background: #2563eb;
		color: white;
	}

	.btn-primary:hover {
		background: #1d4ed8;
	}

	.btn-amber {
		background: #f59e0b;
		color: white;
	}

	.btn-amber:hover {
		background: #d97706;
	}

	.btn-green {
		background: #16a34a;
		color: white;
	}

	.btn-green:hover {
		background: #15803d;
	}

	.btn-secondary {
		background: #f1f5f9;
		color: #1e293b;
		border: 1px solid #e2e8f0;
	}

	.btn-secondary:hover {
		background: #e2e8f0;
	}

	.btn-row {
		display: flex;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.link-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1rem;
	}

	.link-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.25rem;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		transition: border-color 0.15s;
	}

	.link-card:hover {
		border-color: #2563eb;
	}

	.link-title {
		font-weight: 600;
		color: #1e293b;
	}

	.link-desc {
		font-size: 0.85rem;
		color: #64748b;
	}

	.badge {
		display: inline-block;
		padding: 0.3rem 0.75rem;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		flex-shrink: 0;
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
</style>
