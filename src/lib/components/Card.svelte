<script>
	import Mobile from '$lib/themes/Mobile.svelte';
	import Computer from '../themes/Computer.svelte';
	import Likes from '../themes/Likes.svelte';
	import Subscribe from '../themes/Subscribe.svelte';
	import { _ } from 'svelte-i18n';

	import { cubicOut } from 'svelte/easing';
	import { blur, fade, slide } from 'svelte/transition';

	/**
	 * @type {{ initial: boolean, thumbnail: string, channelLogo: string, title: string, channel: string, views: string, time: string, duration: string , isLive: boolean, isUpcoming: boolean, startDate: string, viewers: string, likes?: string, subscribers?: string }}
	 */
	export let data;

	/**
	 * @type {{ style: string, initial: boolean, displayChannel: boolean, duration: number, displayMeta: boolean, theme: string, displayDuration: boolean, rounding: number, textSize: number, advanced: boolean, spacing: number, greenScreen: boolean }}
	 */
	export let config;

	/**
	 * @type {boolean}
	 */
	export let loading;
</script>

<div class="design" class:green-screen={["likes","subscribe"].includes(config.style)} >
	{#key data?.thumbnailUrl}
		<div
			transition:blur={{ duration: 400, easing: cubicOut }}
			class="background"
			style="background-image: url({data?.thumbnailUrl});"
		></div>
	{/key}
	{#if data}
		{#if config.style === 'mobile'}
			<Mobile {data} {config} {loading} />
		{:else if config.style === 'likes'}
			<Likes {data} {config} {loading} />
		{:else if config.style === 'subscribe'}
			<Subscribe {data} {config} {loading} />
		{:else}
			<Computer {data} {config} {loading} />
		{/if}
	{/if}
	{#if ["likes","subscribe"].includes(config.style)}
		<div class="green-screen-info">
			💡 {$_('cards.green_screen_info')}
		</div>
	{/if}
</div>

<style lang="scss">
	.design {
		position: relative;
		display: flex;
		flex-direction: column;

		background: repeating-conic-gradient(#131317 0% 25%, #232330 0% 50%);
		background-size: 25px 25px;
		align-items: center;
		justify-content: center;
		border-radius: 0.75rem;
		min-width: 40vw;
		min-height: 40vh;
		padding: 1rem;
		width: min-content;

		&.green-screen {
			background: #00ff00;
		}

		.background {
			position: absolute;

			z-index: -1;
			top: 0%;
			left: 0%;
			right: 0%;
			bottom: 0%;
			border-radius: 0.75rem;
			background-size: cover;
			background-position: center;
			background-repeat: no-repeat;
			opacity: 0.5;

			filter: blur(2em);
		}

		.green-screen-info {
			position: absolute;
			bottom: 1rem;
			left: 50%;
			transform: translateX(-50%);
			background: rgba(0, 0, 0, 0.8);
			color: #fff;
			padding: 0.5rem 1rem;
			border-radius: 0.5rem;
			font-size: 0.85rem;
			max-width: 90%;
			text-align: center;
			backdrop-filter: blur(10px);
			border: 1px solid rgba(255, 255, 255, 0.1);
		}
	}

	@media screen and (max-width: 700px) {
		.design {
			padding: 1rem;
			min-width: 90vw;

			.green-screen-info {
				font-size: 0.75rem;
				padding: 0.4rem 0.8rem;
			}
		}
	}
</style>
