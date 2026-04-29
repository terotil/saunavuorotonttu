<script lang="ts">
	import { DAY_NAMES } from '$lib/utils.js';

	let { data } = $props();
</script>

<div class="page">
	<header>
		<a href="/" class="back">← Etusivu</a>
		<h1>Saunavuorot</h1>
		{#if data.allocation}
			<p class="period-name">{data.allocation.name}</p>
		{/if}
	</header>

	{#if !data.allocation}
		<div class="notice">
			<p>Voimassa olevia saunavuoroja ei ole julkaistu vielä. Tarkista myöhemmin uudelleen.</p>
		</div>
	{:else if data.byDay.length === 0}
		<div class="notice">
			<p>Ei varauksia tällä hetkellä.</p>
		</div>
	{:else}
		<div class="calendar">
			{#each data.byDay as group}
				<section class="day-card">
					<h2>{DAY_NAMES[group.day]}</h2>
					<ul class="slot-list">
						{#each group.slots as s}
							<li class="slot-item">
								<span class="time">{s.start_time}–{s.end_time}</span>
								<span class="apartment">{s.apartment}</span>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		max-width: 700px;
		margin: 0 auto;
		padding: 1.5rem 1rem;
	}

	header {
		margin-bottom: 2rem;
	}

	.back {
		font-size: 0.85rem;
		color: #64748b;
		text-decoration: none;
		display: block;
		margin-bottom: 0.5rem;
	}

	h1 {
		margin: 0 0 0.35rem;
		font-size: 1.8rem;
	}

	.period-name {
		color: #64748b;
		margin: 0;
		font-size: 0.95rem;
	}

	.notice {
		background: #f8fafc;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		padding: 1.5rem;
		color: #64748b;
		text-align: center;
	}

	.calendar {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.day-card {
		background: white;
		border: 1px solid #e2e8f0;
		border-radius: 8px;
		overflow: hidden;
	}

	h2 {
		margin: 0;
		padding: 0.75rem 1rem;
		background: #f8fafc;
		border-bottom: 1px solid #e2e8f0;
		font-size: 1rem;
		color: #334155;
	}

	.slot-list {
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.slot-item {
		display: flex;
		align-items: center;
		padding: 0.65rem 1rem;
		border-bottom: 1px solid #f1f5f9;
		gap: 1rem;
	}

	.slot-item:last-child {
		border-bottom: none;
	}

	.time {
		font-weight: 600;
		color: #1e293b;
		min-width: 7rem;
		font-variant-numeric: tabular-nums;
	}

	.apartment {
		color: #475569;
	}
</style>
