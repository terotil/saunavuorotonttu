<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();

	const a = $derived(data.allocation);
	const canEdit = $derived(a.status !== 'published');

	let ordered = $state<typeof data.residents>([]);

	$effect(() => {
		ordered = [...data.residents];
	});

	function moveUp(i: number) {
		if (i === 0) return;
		const arr = [...ordered];
		[arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
		ordered = arr;
	}

	function moveDown(i: number) {
		if (i === ordered.length - 1) return;
		const arr = [...ordered];
		[arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
		ordered = arr;
	}
</script>

<div class="header">
	<div>
		<a href="/admin/allocations/{a.id}" class="back">← {a.name}</a>
		<h1>Asukkaat & varausjärjestys</h1>
	</div>
</div>

<section class="card">
	<p class="hint">Järjestä asukkaat varausjärjestykseen. Ylempänä olevalle asukkaalle jaetaan vuoro ensin optimoinnissa.</p>

	{#if form?.reorderError}
		<p class="error">{form.reorderError}</p>
	{/if}

	{#if ordered.length === 0}
		<p class="muted">Ei asukkaita. Lisää asukkaat ensin <a href="/admin/setup">asukashallinnasta</a>.</p>
	{:else}
		<form method="POST" action="?/reorder" use:enhance>
			<ol class="resident-list">
				{#each ordered as r, i}
					<li class="resident-row">
						<input type="hidden" name="resident_ids" value={r.resident_id} />
						<span class="rank">#{i + 1}</span>
						<span class="apartment">{r.apartment}</span>
						<span class="name">{r.name ?? ''}</span>
						<span class="pref-indicator" title={r.has_preferences ? 'Toiveet jätetty' : 'Ei toiveita'}>
							{r.has_preferences ? '✓' : '—'}
						</span>
						{#if canEdit}
							<div class="move-btns">
								<button type="button" class="move-btn" onclick={() => moveUp(i)} disabled={i === 0}>↑</button>
								<button type="button" class="move-btn" onclick={() => moveDown(i)} disabled={i === ordered.length - 1}>↓</button>
							</div>
						{/if}
					</li>
				{/each}
			</ol>
			{#if canEdit}
				<button type="submit" class="btn-save">Tallenna järjestys</button>
			{/if}
		</form>
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
	}

	.hint {
		font-size: 0.9rem;
		color: #64748b;
		margin: 0 0 1.25rem;
	}

	.resident-list {
		list-style: none;
		margin: 0 0 1.25rem;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.resident-row {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 0.75rem;
		background: #f8fafc;
		border-radius: 6px;
		font-size: 0.95rem;
	}

	.rank {
		font-weight: 700;
		color: #94a3b8;
		width: 2.5rem;
		flex-shrink: 0;
	}

	.apartment {
		font-weight: 600;
		min-width: 4rem;
	}

	.name {
		flex: 1;
		color: #64748b;
	}

	.pref-indicator {
		font-size: 0.85rem;
		color: #16a34a;
		min-width: 1.5rem;
		text-align: center;
	}

	.move-btns {
		display: flex;
		gap: 0.25rem;
	}

	.move-btn {
		padding: 0.2rem 0.5rem;
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
		color: #475569;
	}

	.move-btn:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.move-btn:not(:disabled):hover {
		background: #f1f5f9;
	}

	.btn-save {
		padding: 0.65rem 1.5rem;
		background: #2563eb;
		color: white;
		border: none;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.95rem;
	}

	.btn-save:hover {
		background: #1d4ed8;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin: 0 0 0.75rem;
	}

	.muted {
		color: #94a3b8;
	}

	.muted a {
		color: #2563eb;
	}
</style>
