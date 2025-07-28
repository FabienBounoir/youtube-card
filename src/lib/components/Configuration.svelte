<script>
	import { snacks } from '$lib/stores/snacks';
	import { toPng } from 'html-to-image';
	import { domToBlob, domToPng } from 'modern-screenshot';
	import { fade, scale, slide } from 'svelte/transition';
	import Switch from './Switch.svelte';
	import Tooltip from './Tooltip.svelte';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	const regex =
		/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;

	/**
	 * @type {string | null}
	 */
	let action = null;

	let clipboardCopyEnabled = false;

	/**
	 * @type {{ initial: boolean, thumbnailUrl: string, thumbnail: string, channelLogoUrl: string, channelLogo: string, title: string, channel: string, views: string, time: string, duration: string, isLive: boolean, isUpcoming: boolean, startDate: string, viewers: string } | null}
	 */
	export let data;

	/**
	 * @type {{ style: string, initial: boolean, displayChannel: boolean, duration: number, displayMeta: boolean, theme: string, size: number, displayDuration: boolean, url: string, advanced: boolean, rounding: number, textSize: number, spacing: number, autoPaste: boolean, greenScreen: boolean }}
	 */
	export let config;

	let url = '';
	let waitingGeneration = false;

	/**
	 * @type {boolean}
	 */
	export let loading;

	/**
	 *
	 * @param url {string}
	 */
	const findVideoId = (url) => {
		const regex =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		const match = url.match(regex);
		return match ? match[1] : null;
	};

	/**
	 *
	 * @param url {string}
	 * @param notif {boolean}
	 */
	const getVideoData = async (url, notif) => {
		const videoId = findVideoId(url);
		if (!videoId) {
			if (notif) snacks.error($_('configuration.invalid_url'));
			return;
		}

		try {
			loading = true;
			const response = await fetch(`/_api/info`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ videoId, language: navigator.language })
			});

			if (response.status !== 200) {
				if (notif) snacks.error($_('configuration.error_when_fetching'));
				return;
			}

			data = await response.json();
			config.url = url;
			loading = false;
		} catch (error) {
			loading = false;
			if (notif) snacks.error($_('configuration.error_when_fetching'));
		}
	};

	/**
	 *
	 * @param e {MouseEvent | any}
	 */
	const download = async (e) => {
		waitingGeneration = true;
		action = 'download';
		e.target.innerText = 'Generate';

		/**
		 * @type {HTMLElement | any}
		 */
		const node = document.querySelector('.youtube-card');
		const dataUrl = await domToPng(node, {
			scale: 1 + (config.size || 1),
			quality: 1
		});
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = `ytb-${data.channel}-${data.title}.png`;
		a.click();

		waitingGeneration = false;
		e.target.innerText = 'Downloaded!';
		action = null;

		setTimeout(() => {
			e.target.innerText = 'Download';
		}, 2000);
	};

	/**
	 *
	 * @param e {MouseEvent | any}
	 */
	const copyToClipboard = (e) => {
		waitingGeneration = true;
		e.target.innerText = 'Generate';
		action = 'Copy';

		/**
		 * @type {HTMLElement | any}
		 */
		const node = document.querySelector('.youtube-card');
		domToBlob(node, {
			scale: 1 + (config.size || 1),
			quality: 1
		})
			.then(async (blob) => {
				try {
					// Création d'un ClipboardItem avec le Blob
					const clipboardItem = new ClipboardItem({ 'image/png': blob });

					// Copie dans le presse-papier
					await navigator.clipboard.write([clipboardItem]);

					console.log('Image copiée avec succès !');

					waitingGeneration = false;
					e.target.innerText = 'Copied!';
					action = null;
				} catch (error) {
					console.error('Erreur lors de la copie dans le presse-papier :', error);
					waitingGeneration = false;
					e.target.innerText = 'Error!';
					action = null;
				}

				setTimeout(() => {
					e.target.innerText = 'Copy';
				}, 2000);
			})
			.catch((e) => {
				waitingGeneration = false;
				e.target.innerText = 'Error!';
				action = null;

				setTimeout(() => {
					e.target.innerText = 'Copy';
				}, 5000);
			});
	};

	/**
	 *
	 * @param {string} dataUrl
	 * @returns {Blob}
	 */
	const dataUrlToBlob = (dataUrl) => {
		var base64Index = dataUrl.indexOf('base64,') + 'base64,'.length;
		var base64 = dataUrl.substring(base64Index);

		var binary = atob(base64);
		var binaryLength = binary.length;
		var bytes = new Uint8Array(binaryLength);

		for (var i = 0; i < binaryLength; i++) {
			bytes[i] = binary.charCodeAt(i);
		}

		var blob = new Blob([bytes], { type: 'image/png' });
		return blob;
	};

	const checkClipboard = () => {
		setInterval(() => {
			if (config.autoPaste) {
				try {
					navigator.clipboard.readText().then((clipboardElement) => {
						if (
							clipboardElement &&
							clipboardElement != config.url &&
							clipboardElement.match(regex)
						) {
							url = clipboardElement;
						}
					});
				} catch (e) {}
			}
		}, 200);
	};

	checkClipboard();

	onMount(() => {
		if (typeof ClipboardItem != 'undefined') {
			clipboardCopyEnabled = true;
		}
	});

	$: url && getVideoData(url, false);
</script>

<div class="configuration">
	<div class="config">
		<h1>{$_('configuration.options')}</h1>
		<div class="input-container">
			<input
				bind:value={url}
				placeholder={$_('configuration.paste_youtube_url')}
				on:keyup={(e) => e.key === 'Enter' && getVideoData(url, true)}
			/>

			<Tooltip
				title={config?.autoPaste
					? $_('configuration.disable_auto_update')
					: $_('configuration.enable_auto_update')}
				disabledOnMobile={true}
			>
				<button
					class={config?.autoPaste ? 'activate' : ''}
					on:click={() => (config.autoPaste = !config.autoPaste)}
				>
					{#if config?.autoPaste}
						<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none">
							<path
								d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
								stroke="#FFFFFF"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H12H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15"
								stroke="#FFFFFF"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					{:else}
						<svg
							width="20px"
							height="20px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M3 3L21 21"
								stroke="#FFFFFF"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								stroke-width="1.5"
								d="M5.49186 4.40607C4.59965 4.92594 4 5.89294 4 7V19C4 20.6569 5.34315 22 7 22H12H17C18.6569 22 20 20.6569 20 19V18.9142L18 16.9142V19C18 19.5523 17.5523 20 17 20H12H7C6.44772 20 6 19.5523 6 19V7C6 6.44772 6.44772 6 7 6H7.08579L5.49186 4.40607ZM8 6.91421V7C8 7.55228 8.44772 8 9 8H9.08579L8 6.91421ZM18 14.0858V7C18 6.44772 17.5523 6 17 6H16V7C16 7.55228 15.5523 8 15 8H11.9142L7.91421 4H8.17071C8.58254 2.83481 9.69378 2 11 2H13C14.3062 2 15.4175 2.83481 15.8293 4H17C18.6569 4 20 5.34315 20 7V16.0858L18 14.0858ZM14 5V6H10V5C10 4.44772 10.4477 4 11 4H13C13.5523 4 14 4.44772 14 5Z"
								fill="#FFFFFF"
							/>
						</svg>
					{/if}
				</button>
			</Tooltip>
		</div>

		<div class="config-container">
			<span>{$_('configuration.style')}</span>

			<div class="theme-button">
				<button
					class="computer {config.style == 'computer' ? 'select' : ''}"
					on:click={() => (config.style = 'computer')}
				>
					<svg
						width="15"
						height="15"
						viewBox="0 0 15 15"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect x="1" y="1" width="13" height="8" rx="1" fill="#F0F0F0" />
						<rect x="1" y="10" width="12" height="2" rx="1" fill="#727272" />
						<rect x="1" y="13" width="10" height="1" rx="0.5" fill="#727272" />
					</svg>
				</button>
				<button
					class="mobile {config.style == 'mobile' ? 'select' : ''}"
					on:click={() => (config.style = 'mobile')}
					><svg
						width="18"
						height="9"
						viewBox="0 0 18 9"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect y="2" width="8" height="5" rx="1" fill="#F0F0F0" />
						<rect x="9" y="2" width="9" height="2" rx="1" fill="#727272" />
						<rect x="9" y="5" width="7" height="2" rx="1" fill="#727272" />
					</svg>
				</button>
			</div>
		</div>

		<div class="config-container">
			<span>{$_('configuration.display')}</span>

			<div class="display-config-button">
				<Tooltip title={$_('configuration.display_channel')}>
					<button
						class={config.displayChannel ? 'activate displaybutton' : 'displaybutton'}
						on:click={() => (config.displayChannel = !config.displayChannel)}
					>
						<svg
							width="15px"
							height="15px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								opacity="0.4"
								d="M12.1207 12.78C12.0507 12.77 11.9607 12.77 11.8807 12.78C10.1207 12.72 8.7207 11.28 8.7207 9.50998C8.7207 7.69998 10.1807 6.22998 12.0007 6.22998C13.8107 6.22998 15.2807 7.69998 15.2807 9.50998C15.2707 11.28 13.8807 12.72 12.1207 12.78Z"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								opacity="0.34"
								d="M18.7398 19.3801C16.9598 21.0101 14.5998 22.0001 11.9998 22.0001C9.39977 22.0001 7.03977 21.0101 5.25977 19.3801C5.35977 18.4401 5.95977 17.5201 7.02977 16.8001C9.76977 14.9801 14.2498 14.9801 16.9698 16.8001C18.0398 17.5201 18.6398 18.4401 18.7398 19.3801Z"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</Tooltip>

				<Tooltip title={$_('configuration.display_statistics')}>
					<button
						class={config.displayMeta ? 'activate displaybutton' : 'displaybutton'}
						on:click={() => (config.displayMeta = !config.displayMeta)}
					>
						<svg
							width="15px"
							height="15px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M2 22H22"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-miterlimit="10"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								d="M9.75 4V22H14.25V4C14.25 2.9 13.8 2 12.45 2H11.55C10.2 2 9.75 2.9 9.75 4Z"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								opacity="0.4"
								d="M3 10V22H7V10C7 8.9 6.6 8 5.4 8H4.6C3.4 8 3 8.9 3 10Z"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								opacity="0.4"
								d="M17 15V22H21V15C21 13.9 20.6 13 19.4 13H18.6C17.4 13 17 13.9 17 15Z"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</Tooltip>

				<Tooltip title={$_('configuration.display_duration')}>
					<button
						class={config.displayDuration ? 'activate displaybutton' : 'displaybutton'}
						on:click={() => (config.displayDuration = !config.displayDuration)}
					>
						<svg
							width="15px"
							height="15px"
							viewBox="0 0 24 24"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12Z"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
							<path
								opacity="0.4"
								d="M15.7099 15.1798L12.6099 13.3298C12.0699 13.0098 11.6299 12.2398 11.6299 11.6098V7.50977"
								stroke="#f0f0f0"
								stroke-width="1.5"
								stroke-linecap="round"
								stroke-linejoin="round"
							/>
						</svg>
					</button>
				</Tooltip>
			</div>
		</div>

		<div class="config-container">
			<span
				>{$_('configuration.progress')}
				{#if config.duration > 0}<span class="lenght">{config.duration}%</span>{/if}</span
			>
			<input type="range" bind:value={config.duration} min="0" max="100" />
		</div>

		<div class="config-container">
			<span>{$_('configuration.theme')}</span>

			<div class="theme-button">
				<button
					class="dark-theme {config.theme == 'dark' ? 'select' : ''}"
					on:click={() => (config.theme = 'dark')}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="15px"
						height="15px"
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
							stroke="#f0f0f0"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						/>
					</svg>
				</button>
				<button
					class="light-theme {['light', 'white'].includes(config.theme) ? 'select' : ''}"
					on:click={() => (config.theme = 'light')}
					><svg
						xmlns="http://www.w3.org/2000/svg"
						width="15px"
						height="15px"
						viewBox="0 0 24 24"
						fill="none"
					>
						<path
							d="M11 1C11 0.447715 11.4477 0 12 0C12.5523 0 13 0.447715 13 1V3C13 3.55228 12.5523 4 12 4C11.4477 4 11 3.55228 11 3V1Z"
							fill="#f0f0f0"
						/>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12ZM8.06167 12C8.06167 14.1751 9.82492 15.9383 12 15.9383C14.1751 15.9383 15.9383 14.1751 15.9383 12C15.9383 9.82492 14.1751 8.06167 12 8.06167C9.82492 8.06167 8.06167 9.82492 8.06167 12Z"
							fill="#f0f0f0"
						/>
						<path
							d="M20.4853 3.51472C20.0947 3.12419 19.4616 3.12419 19.0711 3.51472L17.6568 4.92893C17.2663 5.31946 17.2663 5.95262 17.6568 6.34315C18.0474 6.73367 18.6805 6.73367 19.0711 6.34315L20.4853 4.92893C20.8758 4.53841 20.8758 3.90524 20.4853 3.51472Z"
							fill="#f0f0f0"
						/>
						<path
							d="M1 13C0.447715 13 0 12.5523 0 12C0 11.4477 0.447715 11 1 11H3C3.55228 11 4 11.4477 4 12C4 12.5523 3.55228 13 3 13H1Z"
							fill="#f0f0f0"
						/>
						<path
							d="M3.51472 3.51472C3.1242 3.90524 3.1242 4.53841 3.51472 4.92893L4.92894 6.34315C5.31946 6.73367 5.95263 6.73367 6.34315 6.34315C6.73368 5.95262 6.73368 5.31946 6.34315 4.92893L4.92894 3.51472C4.53841 3.12419 3.90525 3.12419 3.51472 3.51472Z"
							fill="#f0f0f0"
						/>
						<path
							d="M11 21C11 20.4477 11.4477 20 12 20C12.5523 20 13 20.4477 13 21V23C13 23.5523 12.5523 24 12 24C11.4477 24 11 23.5523 11 23V21Z"
							fill="#f0f0f0"
						/>
						<path
							d="M6.34315 17.6569C5.95263 17.2663 5.31946 17.2663 4.92894 17.6569L3.51473 19.0711C3.1242 19.4616 3.1242 20.0948 3.51473 20.4853C3.90525 20.8758 4.53842 20.8758 4.92894 20.4853L6.34315 19.0711C6.73368 18.6805 6.73368 18.0474 6.34315 17.6569Z"
							fill="#f0f0f0"
						/>
						<path
							d="M21 13C20.4477 13 20 12.5523 20 12C20 11.4477 20.4477 11 21 11H23C23.5523 11 24 11.4477 24 12C24 12.5523 23.5523 13 23 13H21Z"
							fill="#f0f0f0"
						/>
						<path
							d="M17.6568 17.6569C17.2663 18.0474 17.2663 18.6805 17.6568 19.0711L19.0711 20.4853C19.4616 20.8758 20.0947 20.8758 20.4853 20.4853C20.8758 20.0948 20.8758 19.4616 20.4853 19.0711L19.0711 17.6569C18.6805 17.2663 18.0474 17.2663 17.6568 17.6569Z"
							fill="#f0f0f0"
						/>
					</svg></button
				>
			</div>
		</div>

		<div class="config-container">
			<span>{$_('configuration.size')} <span class="lenght">x{config.size || 1}</span></span>
			<input type="range" bind:value={config.size} min="1" max="4" step="1" />
		</div>

		<div class="config-container">
			<span>{$_('configuration.advanced')}</span>
			<Switch bind:value={config.advanced} />
		</div>

		{#if config.advanced}
			<div class="config-submenu" transition:slide>
				<span transition:fade
					>• {$_('configuration.rounding')}
					<span class="lenght">x{config.rounding < 0 ? '-1' : config.rounding || 1}</span></span
				>
				<input
					transition:fade
					type="range"
					bind:value={config.rounding}
					min="-0.1"
					max="5"
					step="0.1"
				/>
			</div>
			<div class="config-submenu" transition:slide>
				<span transition:fade
					>• {$_('configuration.text_size')}
					<span class="lenght">x{config.textSize || 1}</span></span
				>
				<input
					transition:fade
					type="range"
					bind:value={config.textSize}
					min="0.5"
					max="1.5"
					step="0.1"
				/>
			</div>

			<div class="config-submenu" transition:slide>
				<span transition:fade
					>• {$_('configuration.spacing')} <span class="lenght">x{config.spacing || 1}</span></span
				>
				<input
					transition:fade
					type="range"
					bind:value={config.spacing}
					min="0"
					max="2"
					step="0.1"
				/>
			</div>

			<div class="config-submenu" transition:slide>
				<span transition:fade>• {$_('configuration.green_screen')}</span>
				<Switch bind:value={config.greenScreen} />
			</div>
		{/if}

		<div class="button-container">
			{#if clipboardCopyEnabled}
				<button
					class={action == 'copy' ? 'loading' : ''}
					on:click={copyToClipboard}
					disabled={waitingGeneration}
				>
					{$_('configuration.copy')}
				</button>
			{/if}

			<button
				on:click={download}
				disabled={waitingGeneration}
				class={action == 'download' ? 'loading' : ''}
			>
				{$_('configuration.download')}
			</button>
		</div>
	</div>
	<p>
		Project by <a href="https://bento.me/fabienbounoir">@Bouns</a>, source code available on
		<a href="https://github.com/FabienBounoir/youtube-card">Github</a>.
	</p>
</div>

<style lang="scss">
	.loading {
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

	.configuration {
		display: flex;
		flex-direction: column;
		gap: 1rem;

		p {
			font-size: 0.875rem;
			line-height: 1.25rem;
			text-align: center;

			a {
				color: #f0f0f0;
				font-weight: bold;
				text-decoration: none;
			}
		}
	}

	.display-config-button {
		gap: 0.5rem;

		.displaybutton:hover svg {
			animation: scale 0.6s ease infinite alternate;
		}
	}

	@keyframes scale {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0.8);
		}
	}

	.theme-button,
	.display-config-button {
		display: flex;
		align-items: center;
		justify-content: center;

		button {
			display: flex;
			padding: 0.3rem 0.8rem;
			background-color: rgb(23 23 23);
			color: #f0f0f0;
			border: 1px solid rgb(38 38 38);
			border-radius: 0.375rem;
			cursor: pointer;
			transition: background-color 0.2s;

			&:hover {
				background-color: rgb(44, 44, 44);
			}

			svg {
				width: 1.3rem;
				height: 1.3rem;
			}

			opacity: 0.5;
		}

		.activate {
			background-color: rgb(38 38 38);
			opacity: 1;
		}

		.light-theme {
			border-left: 0;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-left: 1px solid rgb(38 38 38);
		}

		.dark-theme {
			border-right: 0;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;
		}

		.mobile {
			border-left: 0;
			border-top-left-radius: 0;
			border-bottom-left-radius: 0;
			border-left: 1px solid rgb(38 38 38);

			&:hover svg {
				animation: scale 0.6s ease infinite alternate;
			}
		}

		.computer {
			border-right: 0;
			border-top-right-radius: 0;
			border-bottom-right-radius: 0;

			&:hover svg {
				animation: scale 0.6s ease infinite alternate;
			}
		}

		.light-theme:hover {
			svg {
				animation: sunRotate 3s ease forwards;
			}
		}

		.dark-theme:hover {
			svg {
				animation: moonRotate 3s ease-out forwards;
			}
		}

		@keyframes sunRotate {
			0%,
			100% {
				transform: rotate(0deg);
			}
			80% {
				transform: rotate(360deg);
			}
		}

		@keyframes moonRotate {
			0%,
			100% {
				opacity: 0.08;
			}
			25% {
				opacity: 1;
				transform: scale(1.1);
			}
			50% {
				opacity: 0.5;
				transform: scale(1);
			}
			75% {
				opacity: 1;
				transform: scale(1.1);
			}
		}

		.select {
			background-color: rgb(38 38 38);
			opacity: 1;
		}
	}

	.config {
		display: flex;
		flex-direction: column;
		background-color: rgb(29 29 29);
		height: fit-content;
		overflow-y: auto;

		border-color: rgb(38 38 38);
		border-width: 1px;
		border-radius: 0.75rem;

		.config-container {
			display: flex;
			padding: 0.8rem 1rem;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			border-top: 1px solid rgb(229 229 229 / 0.1);

			.lenght {
				background-color: rgba(23 23 23);
				border: 1px solid rgb(38 38 38);
				font-size: 0.7rem;
				border-radius: 0.375rem;
				padding: 2px 5px;
			}
		}

		.config-submenu {
			display: flex;
			padding: 0.3rem 1rem 0.8rem 2rem;
			justify-content: space-between;
			align-items: center;
			width: 100%;

			.lenght {
				background-color: rgba(23 23 23);
				border: 1px solid rgb(38 38 38);
				font-size: 0.7rem;
				border-radius: 0.375rem;
				padding: 2px 5px;
			}
		}

		.button-container {
			display: flex;
			padding: 0.8rem 1rem;
			justify-content: space-between;
			align-items: center;
			width: 100%;
			border-top: 1px solid rgb(229 229 229 / 0.1);

			button {
				padding: 0.5rem 1rem;
				background-color: rgb(23 23 23);
				color: #f0f0f0;
				border: 1px solid rgb(38 38 38);
				border-radius: 0.375rem;
				cursor: pointer;
				transition: background-color 0.2s;

				&:hover {
					background-color: rgb(38 38 38);
				}

				&:disabled {
					// background-color: rgb(81 4 4);
					cursor: not-allowed;
				}
			}
		}

		h1 {
			background-color: rgb(23 23 23);
			color: rgb(115 115 115);
			padding: 0.25rem 1rem;
			margin: 0;
			font-size: 0.875rem;
			line-height: 1.25rem;
			text-align: center;
		}

		.input-container {
			background-color: rgb(23 23 23);
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			gap: 0.5rem;

			padding: 0.5rem 1rem;
			min-height: 32px;

			outline: 2px solid transparent;
			outline-offset: 2px;

			border: 1px solid rgb(229 229 229 / 0.1);

			margin: 0.5rem 1rem;
			padding: 6px 0.35rem;

			border-radius: 0.375rem;

			input {
				color: #f0f0f0;
				background-color: transparent;
				border: 0px solid #e5e5e5;
				box-sizing: border-box;
				width: 100%;

				outline: none;
			}

			button {
				display: flex;
				padding: 0.3rem 0.3rem;
				background-color: rgb(23 23 23);
				color: #f0f0f0;
				border: 1px solid rgb(38 38 38);
				border-radius: 0.375rem;
				cursor: pointer;
				transition: background-color 0.2s;

				&:hover {
					background-color: rgb(44, 44, 44);
				}

				svg {
					width: 1.3rem;
					height: 1.3rem;
				}

				&:hover svg {
					animation: scale 0.6s ease infinite alternate;
				}
			}

			.activate {
				background-color: rgb(38 38 38);
			}
		}
	}

	@media screen and (max-width: 700px) {
		.configuration {
			width: 100%;
			margin: 0 1rem 4rem 1rem;
		}
	}
</style>
