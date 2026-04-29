<script lang="ts">
	let { children } = $props();
</script>

<header>
	<a href="/admin" class="logo">Saunavuorotonttu</a>
	<nav>
		<a href="/admin">Varausjaksot</a>
		<a href="/admin/setup">Asukkaat</a>
		<form method="POST" action="/admin/logout">
			<button type="submit" class="logout-btn">Kirjaudu ulos</button>
		</form>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75rem 1.5rem;
		background: #1e293b;
		color: white;
		gap: 1rem;
	}

	.logo {
		color: white;
		text-decoration: none;
		font-size: 1.1rem;
		font-weight: 700;
		flex-shrink: 0;
	}

	nav {
		display: flex;
		align-items: center;
		gap: 1.5rem;
	}

	nav a {
		color: #cbd5e1;
		text-decoration: none;
		font-size: 0.9rem;
	}

	nav a:hover {
		color: white;
	}

	.logout-btn {
		background: none;
		border: 1px solid #475569;
		color: #cbd5e1;
		padding: 0.35rem 0.75rem;
		border-radius: 4px;
		cursor: pointer;
		font-size: 0.85rem;
	}

	.logout-btn:hover {
		background: #334155;
		color: white;
	}

	main {
		max-width: 1000px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}
</style>
