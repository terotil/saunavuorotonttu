<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="login-wrap">
	<div class="login-card">
		<h1>Hallinta</h1>
		<form method="POST" use:enhance>
			{#if form?.error}
				<p class="error">{form.error}</p>
			{/if}
			<label>
				Salasana
				<input type="password" name="password" required />
			</label>
			<button type="submit">Kirjaudu sisään</button>
		</form>
	</div>
</div>

<style>
	.login-wrap {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f8fafc;
	}

	.login-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 2rem;
		width: 100%;
		max-width: 360px;
	}

	h1 {
		margin: 0 0 1.5rem;
		font-size: 1.5rem;
		color: #1e293b;
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

	input {
		padding: 0.6rem 0.75rem;
		border: 1px solid #cbd5e1;
		border-radius: 6px;
		font-size: 1rem;
	}

	button[type='submit'] {
		padding: 0.65rem;
		background: #2563eb;
		color: white;
		border: none;
		border-radius: 6px;
		font-size: 1rem;
		cursor: pointer;
	}

	button[type='submit']:hover {
		background: #1d4ed8;
	}

	.error {
		color: #dc2626;
		font-size: 0.875rem;
		margin: 0;
	}
</style>
