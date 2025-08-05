<script>
	import { _ } from 'svelte-i18n';

	/**
	 * @type {{ initial: boolean, thumbnail: string, channelLogo: string, title: string, channel: string, views: string, time: string, duration: string , isLive: boolean, isUpcoming: boolean, startDate: string, viewers: string, likes?: string, subscribers?: string }}
	 */
	export let data;

	/**
	 * @type {{ initial: boolean, displayChannel: boolean, duration: number, displayMeta: boolean, theme: string, displayDuration: boolean, rounding: number, textSize: number, advanced: boolean, spacing: number, greenScreen: boolean, customTitle?: string, displayChannelName: boolean }}
	 */
	export let config;

	/**
	 * @type {boolean}
	 */
	export let loading;
</script>

<div
	class="subscribe-card {config.theme} {loading ? 'loading' : ''}"
	style="--text-size: {config.advanced ? config.textSize : 1}; --rounding: {config.advanced
		? config.rounding
		: 1}; --spacing: {config.advanced ? config.spacing : 1};"
>
	<div class="channel-info">
		{#if config.displayChannel}
			<img src={data?.channelLogo} alt="channel logo" class="channel-avatar" />
		{/if}
		{#if config.displayChannelName || config.displayMeta}
			<div class="channel-details">
				{#if config.displayChannelName}
					<div class="channel-name" style="font-size: calc(0.875rem * var(--text-size, 1));">
						{data?.channel || 'Nom de la chaîne'}
					</div>
				{/if}
				{#if config.displayMeta}
					<div class="subscriber-count" style="font-size: calc(0.75rem * var(--text-size, 1));">
						{data?.subscribers || '150k'} abonnés
					</div>
				{/if}
			</div>
		{/if}
		<div
			class="subscribe-button"
			class:no-margin={!config.displayChannel && !config.displayChannelName && !config.displayMeta}
		>
			<span class="subscribe-text" style="font-size: calc(0.75rem * var(--text-size, 1));">
				S'abonner
			</span>
		</div>
	</div>
</div>

<style lang="scss">
	.subscribe-card {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		position: relative;
		padding: calc(1rem * var(--spacing, 1));
		border-radius: calc(12px * var(--rounding, 1));

		&.loading {
			animation: pulse 2s ease-in-out infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 0.9;
			}
			50% {
				opacity: 1;
			}
		}

		.channel-info {
			display: flex;
			align-items: center;
			gap: 0.75rem;

			.channel-avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				object-fit: cover;
			}

			.channel-details {
				display: flex;
				flex-direction: column;
				min-width: 0;

				.channel-name {
					font-weight: 500;
					font-family: 'Roboto', sans-serif;
					line-height: 1.2;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				.subscriber-count {
					font-weight: 400;
					font-family: 'Roboto', sans-serif;
					line-height: 1.2;
					opacity: 0.7;
				}
			}
		}

		.subscribe-button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			padding: 0.5rem 1rem;
			border-radius: calc(18px * var(--rounding, 1));
			transition: all 0.15s ease;
			cursor: pointer;
			user-select: none;
			min-height: 32px;
			background-color: #cc0000;
			color: #ffffff;
			font-weight: 500;
			font-family: 'Roboto', sans-serif;
			margin-left: 0.5rem;

			.subscribe-text {
				line-height: 1.2;
				font-weight: 500;
				text-transform: uppercase;
				letter-spacing: 0.0125em;
			}

			&:hover {
				background-color: #b30000;
				transform: translateY(-1px);
				box-shadow: 0 2px 8px rgba(204, 0, 0, 0.3);
			}

			&:active {
				transform: translateY(0);
				background-color: #990000;
				box-shadow: 0 1px 4px rgba(204, 0, 0, 0.4);
			}

			&.no-margin {
				margin-left: 0;
			}
		}
	}

	// Thème clair/blanc (YouTube standard)
	.light,
	.white {
		background-color: #ffffff;
		color: #0f0f0f;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

		.channel-details {
			.channel-name {
				color: #0f0f0f;
			}

			.subscriber-count {
				color: #606060;
			}
		}

		.subscribe-button {
			background-color: #cc0000;
			color: #ffffff;

			&:hover {
				background-color: #b30000;
			}

			&:active {
				background-color: #990000;
			}
		}
	}

	// Thème sombre (YouTube dark mode)
	.dark {
		background-color: #0f0f0f;
		color: #f1f1f1;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

		.channel-details {
			.channel-name {
				color: #f1f1f1;
			}

			.subscriber-count {
				color: #aaa;
			}
		}

		.subscribe-button {
			background-color: #cc0000;
			color: #ffffff;

			&:hover {
				background-color: #b30000;
			}

			&:active {
				background-color: #990000;
			}
		}
	}
</style>
