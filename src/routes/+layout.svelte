<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

{@render children()}

<style>
	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family:
			-apple-system,
			BlinkMacSystemFont,
			'Segoe UI',
			Roboto,
			sans-serif;
		font-size: 16px;
		line-height: 1.5;
		color: #1e293b;
		background: #f8fafc;
	}

	:global(a) {
		color: #2563eb;
	}

	:global(input),
	:global(select),
	:global(textarea) {
		font-family: inherit;
		font-size: inherit;
	}

	:global(button) {
		font-family: inherit;
	}

	:global(h1),
	:global(h2),
	:global(h3) {
		line-height: 1.3;
	}
</style>
