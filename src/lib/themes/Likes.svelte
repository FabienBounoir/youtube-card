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
	class="likes-card {config.theme} {loading ? 'loading' : ''}"
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
			class="likes-button"
			class:no-margin={!config.displayChannel && !config.displayChannelName && !config.displayMeta}
		>
			<div class="like-icon">
				<svg viewBox="0 0 24 24" width="20" height="20">
					<path
						d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<span class="likes-count" style="font-size: calc(0.75rem * var(--text-size, 1));">
				{data?.likes || '1.2k'}
			</span>
		</div>
	</div>
</div>

<style lang="scss">
	.likes-card {
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
				opacity: 0.8;
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

		.likes-button {
			display: inline-flex;
			align-items: center;
			gap: 0.4rem;
			padding: 0.5rem 0.75rem;
			border-radius: calc(18px * var(--rounding, 1));
			transition: all 0.15s ease;
			cursor: pointer;
			user-select: none;
			min-height: 32px;
			margin-left: 0.5rem;

			.like-icon {
				display: flex;
				align-items: center;
				justify-content: center;

				svg {
					transition: transform 0.15s ease;
				}
			}

			.likes-count {
				font-weight: 500;
				font-family: 'Roboto', sans-serif;
				line-height: 1.2;
			}

			&:hover {
				.like-icon svg {
					transform: scale(1.1);
				}
			}

			&:active {
				transform: scale(0.98);
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

		.likes-button {
			background-color: rgba(0, 0, 0, 0.05);
			color: #0f0f0f;

			.like-icon svg {
				color: #0f0f0f;
			}

			&:hover {
				background-color: rgba(0, 0, 0, 0.1);
			}

			&:active {
				background-color: rgba(0, 0, 0, 0.15);
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

		.likes-button {
			background-color: rgba(255, 255, 255, 0.1);
			color: #f1f1f1;

			.like-icon svg {
				color: #f1f1f1;
			}

			&:hover {
				background-color: rgba(255, 255, 255, 0.15);
			}

			&:active {
				background-color: rgba(255, 255, 255, 0.2);
			}
		}
	}
</style>
