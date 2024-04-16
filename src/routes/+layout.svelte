<script>
	import Snacks from '$lib/components/Snacks.svelte';
	import '@fortawesome/fontawesome-free/css/all.min.css';
	import '../app.scss';
</script>

<div>
	<header>
		<h1>Youtube Card Generator</h1>

		<p>
			<em>Youtube Card Generator</em> is a simple tool to generate a youtube card from a youtube
			video URL, Idea proposed by <a href="https://www.youtube.com/@BastiUi">BastiUi</a> and
			challenged by <a href="https://www.youtube.com/@BenjaminCode">Benjamin Code</a>.
		</p>
	</header>

	<slot />
	<Snacks />
</div>

<style lang="scss">
	header {
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem;

		h1 {
			font-size: 2rem;
			font-weight: bold;
		}

		p {
			font-size: 1.25rem;
			line-height: 1.5;
			max-width: 800px;
		}
	}

	a {
		color: var(--accent-color);
		text-decoration: none;
		font-weight: bold;
	}
</style>
