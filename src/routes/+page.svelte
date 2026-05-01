<div class="page">
	<div class="card">
		<h1>Saunavuorot</h1>
		<p>Tervetuloa saunavuorojen hallintaan.</p>

		<div class="actions">
			<a href="/preferences" class="btn-primary">Ilmoita saunavuorotoiveet</a>
			<a href="/results" class="btn-secondary">Katso voimassa olevat vuorot</a>
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
		text-align: center;
	}

	h1 {
		margin: 0 0 0.5rem;
		font-size: 1.8rem;
		color: #1e293b;
	}

	p {
		margin: 0 0 2rem;
		color: #64748b;
		font-size: 0.95rem;
	}

	.actions {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.btn-primary {
		display: block;
		padding: 0.75rem;
		background: #2563eb;
		color: white;
		border-radius: 6px;
		font-size: 1rem;
		font-weight: 600;
		text-decoration: none;
	}

	.btn-primary:hover {
		background: #1d4ed8;
	}

	.btn-secondary {
		display: block;
		padding: 0.75rem;
		background: white;
		color: #475569;
		border: 1px solid #e2e8f0;
		border-radius: 6px;
		font-size: 0.95rem;
		text-decoration: none;
	}

	.btn-secondary:hover {
		background: #f8fafc;
	}
</style>
