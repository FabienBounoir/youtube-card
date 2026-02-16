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

	let isLiked = false;
	let showConfetti = false;
	let justLiked = false;
	let showPulse = false;

	function toggleLike() {
		const wasLiked = isLiked;
		isLiked = !isLiked;
		
		if (isLiked && !wasLiked) {
			showConfetti = true;
			justLiked = true;
			showPulse = true;
			
			setTimeout(() => {
				showConfetti = false;
			}, 1600);
			
			setTimeout(() => {
				justLiked = false;
			}, 600);

			setTimeout(() => {
				showPulse = false;
			}, 1200);
		}
	}
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
						{data?.channel || $_('cards.channel_name')}
					</div>
				{/if}
				{#if config.displayMeta}
					<div class="subscriber-count" style="font-size: calc(0.75rem * var(--text-size, 1));">
						{$_('cards.subscribers', { values: { subscribers: data?.subscribers || '150k' } })}
					</div>
				{/if}
			</div>
		{/if}
		<div class="likes-actions">
			<button
				class="likes-button like"
				class:active={isLiked}
				class:just-clicked={justLiked}
				class:pulse={showPulse}
				class:no-margin={!config.displayChannel && !config.displayChannelName && !config.displayMeta}
				on:click={toggleLike}
				type="button"
				title={$_('cards.like')}
			>
				<div class="like-icon">
					<svg viewBox="0 0 24 24" width="20" height="20">
						{#if isLiked}
							<!-- Thumbs up filled -->
							<path
								d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z"
								fill="currentColor"
							/>
						{:else}
							<!-- Thumbs up outline -->
							<path
								d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z"
								fill="currentColor"
							/>
						{/if}
					</svg>
				</div>
				<span class="likes-count" style="font-size: calc(0.75rem * var(--text-size, 1));">
					{data?.likes || '1.2k'}
				</span>
			
			</button>

			{#if showConfetti}
				<div class="confetti-container">
					{#each Array(16) as _, i}
						<div
							class="confetti"
							class:blue={i % 4 === 0}
							class:red={i % 4 === 1}
							class:yellow={i % 4 === 2}
							class:white={i % 4 === 3}
							style="--delay: {i * 0.03}s; --angle: {i * 22.5 + (Math.random() * 20 - 10)}deg; --distance: {60 + Math.random() * 40}px; --rotation: {Math.random() * 720 - 360}deg;"
						></div>
					{/each}
				</div>
			{/if}
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
		overflow: visible;

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
			overflow: visible;

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

		.likes-actions {
			display: flex;
			align-items: center;
			gap: 0;
			position: relative;
			border-radius: calc(18px * var(--rounding, 1));
			overflow: visible;
		}

		.likes-button {
			display: inline-flex;
			align-items: center;
			gap: 0.4rem;
			padding: 0.5rem 0.75rem;
			border-radius: calc(18px * var(--rounding, 1));
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
			cursor: pointer;
			user-select: none;
			min-height: 36px;
			border: none;
			background: transparent;
			position: relative;
			overflow: visible;

			.like-icon {
				display: flex;
				align-items: center;
				justify-content: center;
				transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

				svg {
					transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
				}
			}

			.likes-count {
				font-weight: 500;
				font-family: 'Roboto', sans-serif;
				line-height: 1.2;
				transition: all 0.3s ease;
			}

			&:hover {
				transform: translateY(-1px) scale(1.03);

				.like-icon svg {
					transform: scale(1.15) rotate(-5deg);
				}
			}

			&:active {
				transform: translateY(0) scale(0.97);
			}

			&.just-clicked {
				animation: likeSuccess 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			}

			&.pulse {
				animation: buttonPulse 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
			}

			&.active {
				.like-icon svg {
					animation: likeBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
					transform: scale(1.1);
				}

				.likes-count {
					font-weight: 600;
				}
			}

			&.no-margin {
				margin-left: 0;
			}
		}

		@keyframes likeSuccess {
			0% {
				transform: scale(1);
			}
			20% {
				transform: scale(1.15) rotate(-3deg);
			}
			40% {
				transform: scale(0.95) rotate(2deg);
			}
			60% {
				transform: scale(1.08) rotate(-1deg);
			}
			80% {
				transform: scale(0.98);
			}
			100% {
				transform: scale(1);
			}
		}

		@keyframes buttonPulse {
			0% {
				box-shadow: 0 0 0 0 rgba(6, 95, 212, 0.7);
			}
			50% {
				box-shadow: 0 0 0 15px rgba(6, 95, 212, 0);
			}
			100% {
				box-shadow: 0 0 0 0 rgba(6, 95, 212, 0);
			}
		}

		@keyframes likeBounce {
			0% {
				transform: scale(1);
			}
			25% {
				transform: scale(1.3) rotate(-12deg);
			}
			50% {
				transform: scale(1) rotate(8deg);
			}
			75% {
				transform: scale(1.15) rotate(-4deg);
			}
			100% {
				transform: scale(1.1) rotate(0deg);
			}
		}

		@keyframes glowPulse {
			0%,
			100% {
				opacity: 0.3;
			}
			50% {
				opacity: 0.6;
			}
		}

		.confetti-container {
			position: absolute;
			top: 50%;
			left: 30%;
			transform: translate(-50%, -50%);
			pointer-events: none;
			width: 200px;
			height: 200px;
			z-index: 10;
		}

		.confetti {
			position: absolute;
			width: 8px;
			height: 8px;
			top: 50%;
			left: 50%;
			border-radius: 50%;
			opacity: 0;
			background-color: #ffffff;
			animation: confettiExplosion 1.6s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
			animation-delay: var(--delay, 0s);

			&.blue {
				background: linear-gradient(135deg, #065fd4, #3ea6ff);
			}

			&.red {
				background: linear-gradient(135deg, #ff0000, #ff6b6b);
			}

			&.yellow {
				background: linear-gradient(135deg, #ffd700, #ffed4e);
			}

			&.white {
				background: #ffffff;
			}
		}

		@keyframes confettiExplosion {
			0% {
				opacity: 0;
				transform: translate(-50%, -50%) scale(0) rotate(0deg);
			}
			15% {
				opacity: 1;
				transform: translate(
						calc(-50% + cos(var(--angle)) * var(--distance) * 0.3),
						calc(-50% + sin(var(--angle)) * var(--distance) * 0.3)
					)
					scale(1.4) rotate(calc(var(--rotation) * 0.3));
			}
			100% {
				opacity: 0;
				transform: translate(
						calc(-50% + cos(var(--angle)) * var(--distance)),
						calc(-50% + sin(var(--angle)) * var(--distance) + 40px)
					)
					scale(0.2) rotate(var(--rotation));
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

			&.active {
				background: linear-gradient(135deg, #065fd4 0%, #0a7aff 100%);
				color: #ffffff;
				box-shadow: 0 4px 12px rgba(6, 95, 212, 0.4);

				.like-icon svg {
					color: #ffffff;
					filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
				}

				.likes-count {
					color: #ffffff;
					text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
				}

				&:hover {
					background: linear-gradient(135deg, #0757c7 0%, #0968e6 100%);
					box-shadow: 0 6px 16px rgba(6, 95, 212, 0.5);
					transform: translateY(-2px) scale(1.03);
				}
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

			&.active {
				color: #3ea6ff;

				.like-icon svg {
					color: #3ea6ff;
				}
			}
		}
	}
</style>
