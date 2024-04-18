<script>
	import { onMount } from 'svelte';
	import Configuration from '$lib/components/Configuration.svelte';
	import Card from '$lib/components/Card.svelte';

	/**
	 * @type {{ initial: boolean, thumbnail: string, channelLogo: string, title: string, channel: string, views: string, time: string, duration: string }}
	 */
	let data = null;

	/**
	 * @type {{ initial: boolean, displayChannel: boolean, duration: number, displayMeta: boolean, theme: string, size: number, displayDuration: boolean }}
	 */
	let config = {
		initial: true,
		displayChannel: false,
		duration: 0,
		displayMeta: true,
		theme: 'white',
		size: 2,
		displayDuration: true
	};

	let loading = false;

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
		} else {
			data = {
				initial: true,
				thumbnail: '/thumbnail.webp',
				channelLogo: '/basti-logo.png',
				title: 'Je quitte mon CDI de Designer',
				channel: 'BastiUi',
				views: '31,2 k',
				time: 'il y a 2 ans',
				duration: '09:27'
			};
		}
	});

	/**
	 *
	 * @param type {string}
	 * @param value {any}
	 */
	const updateLocalStorage = (type, value) => {
		try {
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
		} catch (e) {}
	};
</script>

<section>
	<Card bind:data bind:config bind:loading />

	<Configuration bind:config bind:data bind:loading />
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
