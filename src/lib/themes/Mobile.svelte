<script>
	import { cubicOut } from 'svelte/easing';
	import { blur, fade, slide } from 'svelte/transition';
	import { _ } from 'svelte-i18n';

	/**
	 * @type {{ initial: boolean, thumbnail: string, channelLogo: string, title: string, channel: string, views: string, time: string, duration: string , isLive: boolean, isUpcoming: boolean, startDate: string, viewers: string }}
	 */
	export let data;

	/**
	 * @type {{ initial: boolean, displayChannel: boolean, duration: number, displayMeta: boolean, theme: string, displayDuration: boolean, rounding: number, textSize: number, advanced: boolean, spacing: number }}
	 */
	export let config;

	/**
	 * @type {boolean}
	 */
	export let loading;
</script>

<div
	class="youtube-card {config.theme} {loading ? 'loading' : ''}"
	style="--rounding: {config.advanced ? config.rounding : 1}; --text-size: {config.advanced
		? config.textSize
		: 1};{config.rounding < 0 ? ` border-radius: 0 !important;` : ''}; --spacing: {config.advanced
		? config.spacing
		: 1};"
>
	<div class="thumbnail" style="background-image: url({data?.thumbnail});">
		{#if data?.thumbnailUrl}
			<img src={data?.thumbnailUrl} alt="youtube thumbnail" />
		{/if}

		{#if data?.duration && config.displayDuration}
			{#if data?.isLive}
				<div class="duration live">{$_('cards.live')}</div>
			{:else if data?.isUpcoming}
				<div class="duration upcoming">{$_('cards.upcoming')}</div>
			{:else}
				<div class="duration">{data?.duration}</div>
			{/if}
		{/if}

		{#if config.duration > 0}
			<div class="navigation" style="--progress: {config.duration}%"></div>
		{/if}
	</div>
	<div class="info">
		<div>
			<h3>{data?.title}</h3>
			{#if config.displayMeta}
				<div class="meta">
					{#if data?.isUpcoming}
						<span>{$_('cards.planned_for', { values: { date: data?.startDate } })}</span>
					{:else if data?.isLive}
						<span>{$_('cards.viewers', { values: { viewers: data?.viewers } })}</span>
					{:else}
						<span>{$_('cards.views_time', { values: { views: data?.views } })} • {data?.time}</span>
					{/if}
				</div>
			{/if}

			{#if config.displayChannel}
				<div class="channelContainer">
					<img src={data?.channelLogo} alt="youtube channel logo" />
					<span>{data?.channel}</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	.youtube-card {
		transition: all 0.3s;
		max-width: min(100%, 400px);
		background-color: white;
		border-radius: calc(((0.5rem * var(--rounding, 1)) + calc(1rem * var(--spacing, 1))));
		padding: calc(1rem * var(--spacing, 1));
		min-width: min(100%, 350px);
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;

		&.loading {
			animation: loadingEffectOpacity 1.5s ease-in-out infinite;
		}

		@keyframes loadingEffectOpacity {
			0% {
				opacity: 0.3;
			}
			50% {
				opacity: 0.6;
			}
			100% {
				opacity: 0.3;
			}
		}

		.navigation {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 4px;
			width: 100%;
			z-index: 6;

			&::before {
				content: '';
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
				width: var(--progress, 50%);
			}
		}

		.channelContainer {
			display: flex;
			flex-direction: row;
			align-items: center;
			gap: 0.7rem;
			margin-top: 12px;

			span {
				font-weight: bold;
				color: black;
			}
		}

		.thumbnail {
			position: relative;
			border-radius: calc(0.5rem * var(--rounding, 1));
			overflow: hidden;
			aspect-ratio: 16 / 9;
			background-position: center;
			background-size: cover;
			min-height: 100px;
			width: 100%;
			height: 100%;

			& > img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

			.duration {
				position: absolute;
				bottom: 0;
				right: 0;
				display: inline-flex;
				padding: 3px 4px;
				border-radius: calc(4px * var(--rounding, 1));
				font-size: 0.75rem;
				margin: 0.5rem;
				font-weight: 500;
			}
		}

		.info {
			flex: auto;
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			width: 100%;

			.meta {
				display: flex;
				flex-direction: column;
				justify-content: center;

				font-family: 'Roboto', 'Arial', sans-serif;
				font-size: calc(0.9rem * var(--text-size, 1));
				line-height: calc(1.5rem * var(--text-size, 1));
				font-weight: 400;
				margin: 4px 0 0 0;

				span {
					display: block;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}

			img {
				height: 45px;
				border-radius: 50%;
				aspect-ratio: 1 / 1;
			}

			h3 {
				font-size: calc(1.03rem * var(--text-size, 1));
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
				overflow: hidden;
				text-overflow: ellipsis;
			}
		}
	}

	.dark {
		background-color: #0f0f0f;
		.navigation {
			width: 100%;
			background-color: #5e5e5ee8;

			&::before {
				width: var(--progress, 50%);
				background-color: #f00;
			}
		}

		.thumbnail {
			.duration {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.6);
			}

			.live {
				background-color: rgba(204, 0, 0, 0.85) !important;
				font-weight: 600;
			}
		}

		.info {
			.meta {
				color: #aaa;
			}

			h3 {
				color: #f1f1f1;
			}
		}

		.channelContainer {
			span {
				color: #f1f1f1;
			}
		}
	}

	.white,
	.light {
		.navigation {
			width: 100%;
			background-color: #5e5e5ee8;

			&::before {
				width: var(--progress, 50%);
				background-color: #f00;
			}
		}

		.thumbnail {
			.duration {
				color: #fff;
				background-color: rgba(0, 0, 0, 0.6);
			}

			.live {
				background-color: rgba(204, 0, 0, 0.85) !important;
				font-weight: 600;
			}
		}

		.info {
			.meta {
				color: #606060;
			}

			h3 {
				color: #0f0f0f;
			}
		}
	}
</style>
