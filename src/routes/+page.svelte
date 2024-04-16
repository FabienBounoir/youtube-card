<script>
	import { onMount } from 'svelte';
	import Configuration from '$lib/components/Configuration.svelte';
	import Card from '$lib/components/Card.svelte';

	let data = {
		initial: true,
		thumbnail: '/thumbnail.webp',
		channelLogo: '/basti-logo.png',
		title: 'Je quitte mon CDI de Designer',
		channel: 'BastiUi',
		views: '31,2 k vues',
		time: 'il y a 2 ans',
		duration: '09:27'
	};

	let config = {
		initial: true,
		displayChannel: false,
		duration: 0,
		displayMeta: true,
		theme: 'dark'
	};

	$: updateLocalStorage('config', config);
	$: updateLocalStorage('data', data);

	onMount(() => {
		const savedConfig = localStorage.getItem('config');
		const savedData = localStorage.getItem('data');
		if (savedConfig) {
			config = JSON.parse(savedConfig);
		}

		if (savedData) {
			data = JSON.parse(savedData);
		}
	});

	const updateLocalStorage = (type, value) => {
		if (typeof localStorage !== 'undefined') {
			if (value.initial) {
				value.initial = false;
				return;
			}

			if (type === 'config') {
				localStorage.setItem('config', JSON.stringify(value));
			} else {
				localStorage.setItem('data', JSON.stringify(value));
			}
		}
	};
</script>

<section>
	<Card bind:data bind:config />

	<Configuration bind:config bind:data />
</section>

<style lang="scss">
	section {
		accent-color: red;
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		grid-template-columns: 1fr 400px;
		gap: 1.5rem;
	}
</style>
