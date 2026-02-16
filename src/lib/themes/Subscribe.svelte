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

	let isSubscribed = false;
	let showNotifications = false;
	let showConfetti = false;
	let justSubscribed = false;
	let bellShaking = false;
	let bellJustAppeared = false;

	function toggleSubscribe() {
		const wasSubscribed = isSubscribed;
		isSubscribed = !isSubscribed;
		
		if (isSubscribed && !wasSubscribed) {
			// Animation de confettis lors de l'abonnement
			showConfetti = true;
			justSubscribed = true;
			showNotifications = false;
			bellJustAppeared = true;
			
			setTimeout(() => {
				showConfetti = false;
			}, 1500);
			
			setTimeout(() => {
				justSubscribed = false;
			}, 600);

			setTimeout(() => {
				bellJustAppeared = false;
			}, 800);
		}
	}

	function toggleNotifications() {
		if (isSubscribed) {
			const wasActive = showNotifications;
			showNotifications = !showNotifications;
			bellShaking = true;
			setTimeout(() => {
				bellShaking = false;
			}, 800);
		}
	}
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
		<div class="subscribe-actions">
			<div class="subscribe-button-wrapper">
				<button
					class="subscribe-button"
					class:subscribed={isSubscribed}
					class:just-subscribed={justSubscribed}
					class:no-margin={!config.displayChannel && !config.displayChannelName && !config.displayMeta}
					on:click={toggleSubscribe}
					type="button"
				>
					<span class="subscribe-text" style="font-size: calc(0.75rem * var(--text-size, 1));">
						{isSubscribed ? $_('cards.subscribed') : $_('cards.subscribe')}
					</span>
				</button>
				
				{#if showConfetti}
					<div class="confetti-container">
						{#each Array(20) as _, i}
							<div 
								class="confetti" 
								class:red={i % 2 === 0}
								style="--delay: {i * 0.02}s; --angle: {i * 18}deg; --start-distance: {35}px; --distance: {70 + (i % 4) * 20}px; --rotation: {i * 60}deg; --scale: {0.8 + (i % 3) * 0.2};"
							></div>
						{/each}
					</div>
				{/if}
			</div>
			
			{#if isSubscribed}
				<button
					class="notification-button"
					class:active={showNotifications}
					class:shaking={bellShaking}
					class:just-appeared={bellJustAppeared}
					on:click={toggleNotifications}
					type="button"
					title={showNotifications
						? $_('cards.all_notifications')
						: $_('cards.personalized_notifications')}
				>
					{#if showNotifications}
						<svg
							viewBox="0 0 24 24"
							width="20"
							height="20"
							fill="currentColor"
							class="bell-icon"
						>
							<path
								d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
							/>
						</svg>
					{:else}
						<svg
							viewBox="0 0 24 24"
							width="20"
							height="20"
							fill="currentColor"
							class="bell-icon"
						>
							<path
								d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
							/>
							<path
								d="M4 4l16 16"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
							/>
						</svg>
					{/if}
					{#if bellJustAppeared}
						<div class="bell-particles">
							{#each Array(8) as _, i}
								<div class="particle" style="--angle: {i * 45}deg;"></div>
							{/each}
						</div>
					{/if}
				</button>
			{/if}
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

		.subscribe-actions {
			display: flex;
			align-items: center;
			gap: 0.5rem;
			position: relative;
		}

		.subscribe-button-wrapper {
			position: relative;
			display: inline-flex;
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
			border: none;
			position: relative;
			overflow: visible;

			.subscribe-text {
				line-height: 1.2;
				font-weight: 500;
				text-transform: uppercase;
				letter-spacing: 0.0125em;
			}

			&:hover {
				background-color: #b30000;
				transform: translateY(-1px) scale(1.02);
				box-shadow: 0 2px 8px rgba(204, 0, 0, 0.3);
			}

			&:active {
				transform: translateY(0) scale(0.98);
				background-color: #990000;
				box-shadow: 0 1px 4px rgba(204, 0, 0, 0.4);
			}

			&.just-subscribed {
				animation: subscribeSuccess 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
			}

			&.subscribed {
				background-color: #272727;
				color: #f1f1f1;

				&:hover {
					background-color: #3a3a3a;
					box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
				}

				&:active {
					background-color: #202020;
					box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
				}
			}

			&.no-margin {
				margin-left: 0;
			}
		}

		@keyframes subscribeSuccess {
			0% {
				transform: scale(1);
			}
			25% {
				transform: scale(1.1);
			}
			50% {
				transform: scale(0.95);
			}
			75% {
				transform: scale(1.05);
			}
			100% {
				transform: scale(1);
			}
		}

		.notification-button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
			width: 32px;
			height: 32px;
			border-radius: 50%;
			background-color: #f1f1f1;
			color: #0f0f0f;
			border: none;
			cursor: pointer;
			transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
			padding: 0;
			opacity: 0;
			position: relative;
			overflow: visible;

			&.just-appeared {
				animation: bellSlideIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s forwards;

				.bell-icon {
					animation: bellPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s;
				}
			}

			&:not(.just-appeared) {
				opacity: 1;
			}

			.bell-icon {
				transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
				position: relative;
				z-index: 1;
			}

			&:hover {
				background-color: #e5e5e5;
				transform: scale(1.03);
				box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
			}

			&:active {
				transform: translateY(0) scale(0.97);
				background-color: #d9d9d9;
				box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
			}

			&.shaking {
				animation: bellIntenseShake 0.8s ease-in-out !important;
			}

			&.active {
				background-color: #272727;
				color: #f1f1f1;
				box-shadow: 0 0 0 3px rgba(39, 39, 39, 0.2);

				&:hover {
					background-color: #3a3a3a;
					box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3), 0 0 0 3px rgba(39, 39, 39, 0.3);
				}

				&:active {
					background-color: #202020;
				}
			}
		}

		.bell-particles {
			position: absolute;
			top: 50%;
			left: 50%;
			width: 100%;
			height: 100%;
			pointer-events: none;
			z-index: 0;

			.particle {
				position: absolute;
				top: 50%;
				left: 50%;
				width: 4px;
				height: 4px;
				background: #ffffff;
				border-radius: 50%;
				opacity: 0;
				animation: particleBurst 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
				animation-delay: 0.1s;
			}
		}

		@keyframes bellSlideIn {
			0% {
				opacity: 0;
				transform: translateX(-12px) scale(0.3) rotate(-30deg);
			}
			50% {
				transform: translateX(3px) scale(1.15) rotate(5deg);
			}
			70% {
				transform: translateX(-1px) scale(0.95) rotate(-2deg);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1) rotate(0deg);
			}
		}

		@keyframes bellPop {
			0%,
			100% {
				transform: scale(1) rotate(0deg);
			}
			30% {
				transform: scale(1.15) rotate(-8deg);
			}
			60% {
				transform: scale(0.95) rotate(5deg);
			}
		}

		@keyframes bellIntenseShake {
			0%,
			100% {
				transform: rotate(0deg);
			}
			10% {
				transform: rotate(-8deg);
			}
			20% {
				transform: rotate(8deg);
			}
			30% {
				transform: rotate(-6deg);
			}
			40% {
				transform: rotate(6deg);
			}
			50% {
				transform: rotate(-4deg);
			}
			60% {
				transform: rotate(4deg);
			}
			70% {
				transform: rotate(-2deg);
			}
			80% {
				transform: rotate(2deg);
			}
			90% {
				transform: rotate(-1deg);
			}
		}

		@keyframes particleBurst {
			0% {
				opacity: 1;
				transform: translate(-50%, -50%) translate(0, 0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translate(-50%, -50%)
					translate(
						calc(cos(var(--angle)) * 25px),
						calc(sin(var(--angle)) * 25px)
					)
					scale(0);
			}
		}

		@keyframes bellShake {
			0%,
			100% {
				transform: rotate(0deg);
			}
			10%,
			30%,
			50%,
			70%,
			90% {
				transform: rotate(-10deg);
			}
			20%,
			40%,
			60%,
			80% {
				transform: rotate(10deg);
			}
		}

		.confetti-container {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			pointer-events: none;
			width: 300px;
			height: 300px;
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
			animation: confettiExplosion 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
			animation-delay: var(--delay, 0s);
			box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);

			&.red {
				background-color: #ff0000;
				box-shadow: 0 0 6px rgba(255, 0, 0, 0.6);
			}
		}

		@keyframes confettiExplosion {
			0% {
				opacity: 0;
				transform: translate(
						calc(-50% + cos(var(--angle)) * var(--start-distance, 0px)),
						calc(-50% + sin(var(--angle)) * var(--start-distance, 0px))
					)
					scale(0) 
					rotate(0deg);
			}
			10% {
				opacity: 1;
				transform: translate(
						calc(-50% + cos(var(--angle)) * var(--start-distance, 0px)),
						calc(-50% + sin(var(--angle)) * var(--start-distance, 0px))
					)
					scale(var(--scale, 1)) 
					rotate(calc(var(--rotation) * 0.2));
			}
			100% {
				opacity: 0;
				transform: translate(
						calc(-50% + cos(var(--angle)) * var(--distance)),
						calc(-50% + sin(var(--angle)) * var(--distance))
					)
					scale(0.2) 
					rotate(calc(var(--rotation) * 2));
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

			&.subscribed {
				background-color: #f2f2f2;
				color: #0f0f0f;

				&:hover {
					background-color: #e5e5e5;
				}

				&:active {
					background-color: #d9d9d9;
				}
			}

			&:hover {
				background-color: #b30000;
			}

			&:active {
				background-color: #990000;
			}
		}

		.notification-button {
			background-color: #f2f2f2;
			color: #0f0f0f;

			&:hover {
				background-color: #e5e5e5;
			}

			&:active {
				background-color: #d9d9d9;
			}

			&.active {
				background-color: #0f0f0f;
				color: #f1f1f1;

				&:hover {
					background-color: #272727;
				}

				&:active {
					background-color: #3a3a3a;
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

		.subscribe-button {
			background-color: #cc0000;
			color: #ffffff;

			&.subscribed {
				background-color: #272727;
				color: #f1f1f1;

				&:hover {
					background-color: #3a3a3a;
				}

				&:active {
					background-color: #202020;
				}
			}

			&:hover {
				background-color: #b30000;
			}

			&:active {
				background-color: #990000;
			}
		}

		.notification-button {
			background-color: #272727;
			color: #f1f1f1;

			&:hover {
				background-color: #3a3a3a;
			}

			&:active {
				background-color: #202020;
			}

			&.active {
				background-color: #f1f1f1;
				color: #0f0f0f;

				&:hover {
					background-color: #e5e5e5;
				}

				&:active {
					background-color: #d9d9d9;
				}
			}
		}
	}
</style>