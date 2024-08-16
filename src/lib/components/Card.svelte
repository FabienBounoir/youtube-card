<script>
	import { cubicOut } from 'svelte/easing';
	import { blur, fade, slide } from 'svelte/transition';

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

<div class="design">
	{#key data?.thumbnail}
		<div
			transition:blur={{ duration: 400, easing: cubicOut }}
			class="background"
			style="background-image: url({data?.thumbnail});"
		></div>
	{/key}
	{#if data}
		<div
			class="youtube-card {config.theme} {loading ? 'loading' : ''}"
			style="--rounding: {config.advanced ? config.rounding : 1}; --text-size: {config.advanced
				? config.textSize
				: 1};{config.rounding < 0
				? ` border-radius: 0 !important;`
				: ''}; --spacing: {config.advanced ? config.spacing : 1};"
		>
			<div class="thumbnail" style="background-image: url({data?.thumbnail});">
				{#if data?.thumbnailUrl}
					<img src={data?.thumbnailUrl} alt="youtube thumbnail" />
				{/if}

				{#if data?.duration && config.displayDuration}
					{#if data?.isLive}
						<div class="duration live">EN DIRECT</div>
					{:else if data?.isUpcoming}
						<div class="duration upcoming">À VENIR</div>
					{:else}
						<div class="duration">{data?.duration}</div>
					{/if}
				{/if}

				{#if config.duration > 0}
					<div class="navigation" style="--progress: {config.duration}%"></div>
				{/if}
			</div>
			<div class="info">
				{#if config.displayChannel}
					<img src={data?.channelLogo} alt="youtube channel logo" />
				{/if}
				<div>
					<h3>{data?.title}</h3>
					{#if config.displayMeta}
						<div class="meta">
							{#if config.displayChannel}
								<span>{data?.channel}</span>
							{/if}

							{#if data?.isUpcoming}
								<span>Planifier pour le {data?.startDate}</span>
							{:else if data?.isLive}
								<span>{data?.viewers} spectateurs</span>
							{:else}
								<span>{data?.views} vues • {data?.time}</span>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
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

		.youtube-card {
			transition: all 0.3s;
			max-width: min(100%, 400px);
			background-color: white;
			border-radius: calc(((0.5rem * var(--rounding, 1)) + calc(1rem * var(--spacing, 1))));
			padding: calc(1rem * var(--spacing, 1));
			min-width: min(100%, 350px);

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

			.thumbnail {
				position: relative;
				border-radius: calc(0.5rem * var(--rounding, 1));
				overflow: hidden;
				aspect-ratio: 16 / 9;
				background-position: center;
				background-size: cover;

				& > img {
					width: 100%;
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
					font-size: calc(1rem * var(--text-size, 1));
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
					margin-top: 12px;
					margin-right: 12px;
					border-radius: 50%;
					aspect-ratio: 1 / 1;
				}

				h3 {
					font-size: calc(1.17rem * var(--text-size, 1));
					margin: 12px 0 0px 0;
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
	}

	@media screen and (max-width: 700px) {
		.design {
			padding: 1rem;
			min-width: 90vw;
		}
	}
</style>
