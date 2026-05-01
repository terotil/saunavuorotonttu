<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
</script>

<div class="page">
	<div class="card">
		<h1>Saunavuorot</h1>

		{#if !data.allocation || data.allocation.status !== 'open'}
			<p class="notice">Toiveiden syöttö ei ole tällä hetkellä auki. Tarkista myöhemmin uudelleen.</p>
		{:else}
			<p>Valitse huoneistosi ilmoittaaksesi saunavuorotoiveesi.</p>

			<form method="POST" use:enhance>
				{#if form?.error === 'already_exists'}
					<p class="error">
						Tällä huoneistolla on jo toiveet tähän varausjaksoon. Jos olet kadottanut
						linkkisi, ota yhteyttä: <a href="mailto:{form.adminEmail}">{form.adminEmail || 'ylläpitoon'}</a>.
					</p>
				{:else if form?.error}
					<p class="error">{form.error}</p>
				{/if}

				<label>
					Huoneisto
					<select name="resident_id" required>
						<option value="">– Valitse huoneisto –</option>
						{#each data.residents as r}
							<option value={r.id}>{r.apartment}{r.name ? ` (${r.name})` : ''}</option>
						{/each}
					</select>
				</label>

				<button type="submit">Jatka →</button>
			</form>
		{/if}

		<div class="links">
			<a href="/results">Katso voimassa olevat vuorot</a>
		</div>
	</div>
</div>

<style>
	.page {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f8fafc;
		padding: 1rem;
	}

	.card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 10px;
		padding: 2.5rem 2rem;
		width: 100%;
		max-width: 400px;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 1.8rem;
		color: #1e293b;
	}

	p {
		margin: 0 0 1.5rem;
		color: #64748b;
		font-size: 0.95rem;
	}

	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	label {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		font-size: 0.9rem;
		color: #475569;
	}

	select {
		padding: 0.7rem 0.85rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 1rem;
		background: white;
	}

	select:focus {
		outline: 2px solid #2563eb;
		border-color: transparent;
	}

	button[type='submit'] {
		padding: 0.75rem;
		background: #2563eb;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
		font-weight: 600;
	}

	button[type='submit']:hover {
		background: #1d4ed8;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin: 0;
	}

	.error a {
		color: #dc2626;
	}

	.notice {
		background: #fef3c7;
		border: 1px solid #fde047;
		border-radius: 8px;
		padding: 1rem 1.25rem;
		color: #854d0e;
		font-size: 0.95rem;
	}

	.links {
		margin-top: 1.5rem;
		text-align: center;
	}

	.links a {
		font-size: 0.875rem;
		color: #64748b;
	}
</style>
