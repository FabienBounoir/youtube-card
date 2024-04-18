<script>
	import { snacks } from '$lib/stores/snacks';
	import { toPng } from 'html-to-image';
	import Switch from './Switch.svelte';

	let action = null;

	/**
	 * @type {{ initial: boolean, thumbnail: string, channelLogo: string, title: string, channel: string, views: string, time: string, duration: string }}
	 */
	export let data;

	/**
	 * @type {{ initial: boolean, displayChannel: boolean, duration: number, displayMeta: boolean, theme: string, size: number, displayDuration: boolean }}
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
	 */
	const getVideoData = async (url, notif) => {
		const videoId = findVideoId(url);
		if (!videoId) {
			if (notif) snacks.error('Invalid youtube video URL');
			return;
		}

		try {
			loading = true;
			const response = await fetch(`/_api/info`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ videoId })
			});

			if (response.status !== 200) {
				if (notif) snacks.error('An error occured while fetching the video data');
				return;
			}

			data = await response.json();
			loading = false;
		} catch (error) {
			loading = false;
			if (notif) snacks.error('An error occured while fetching the video data');
		}
	};

	const download = async (e) => {
		waitingGeneration = true;
		action = 'download';
		e.target.innerText = 'Generate';

		/**
		 * @type {HTMLElement}
		 */
		const node = document.querySelector('.youtube-card');
		const dataUrl = await toPng(node, {
			canvasWidth: node.offsetWidth * (config.size || 1),
			canvasHeight: node.offsetHeight * (config.size || 1),
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

	const copyToClipboard = (e) => {
		waitingGeneration = true;
		e.target.innerText = 'Generate';
		action = 'copy';

		/**
		 * @type {HTMLElement}
		 */
		const node = document.querySelector('.youtube-card');
		toPng(node, {
			canvasWidth: node.offsetWidth * (config.size || 1),
			canvasHeight: node.offsetHeight * (config.size || 1),
			quality: 1
		}).then(async (dataUrl) => {
			await navigator.clipboard.write([
				new ClipboardItem({
					'image/png': dataUrlToBlob(dataUrl)
				})
			]);

			waitingGeneration = false;
			e.target.innerText = 'Copied!';
			action = null;

			setTimeout(() => {
				e.target.innerText = 'Copy';
			}, 2000);
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

	$: url && getVideoData(url, false);
</script>

<div class="configuration">
	<div class="config">
		<h1>Card options</h1>
		<div class="input-container">
			<input
				bind:value={url}
				placeholder="Paste youtube video URL"
				on:keyup={(e) => e.key === 'Enter' && getVideoData(url, true)}
			/>
		</div>

		<div class="config-container">
			<span>Display channel logo</span>
			<Switch label="" design="slider" bind:value={config.displayChannel} />
		</div>

		<div class="config-container">
			<span>Display statistics</span>
			<Switch label="" design="slider" bind:value={config.displayMeta} />
		</div>

		<div class="config-container">
			<span>Display duration</span>
			<Switch label="" design="slider" bind:value={config.displayDuration} />
		</div>

		<div class="config-container">
			<span
				>Progress {#if config.duration > 0}<span class="lenght">{config.duration}%</span>{/if}</span
			>
			<input type="range" bind:value={config.duration} min="0" max="100" />
		</div>

		<div class="config-container">
			<span>Theme</span>

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
							stroke-width="2"
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
			<span>Size <span class="lenght">x{config.size || 1}</span></span>
			<input type="range" bind:value={config.size} min="1" max="10" step="1" />
		</div>

		<div class="button-container">
			<button
				class={action == 'copy' ? 'loading' : ''}
				on:click={copyToClipboard}
				disabled={waitingGeneration}
			>
				Copy
			</button>

			<button
				on:click={download}
				disabled={waitingGeneration}
				class={action == 'download' ? 'loading' : ''}
			>
				Download
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

	.theme-button {
		display: flex;
		align-items: center;
		justify-content: center;

		.dark-theme,
		.light-theme {
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
			display: flex;
			flex-direction: row;
			flex-wrap: nowrap;
			gap: 0.5rem;

			padding: 0.5rem 1rem;

			outline: 2px solid transparent;
			outline-offset: 2px;

			box-shadow:
				0 0 #0000,
				0 0 #0000,
				0 1px 3px 0 rgba(0, 0, 0, 0.1),
				0 1px 2px -1px rgba(0, 0, 0, 0.1);

			margin: 0.5rem 1rem;
			padding: 6px 0.35rem;
			border: 1px solid rgb(229 229 229 / 0.3);
			border-radius: 0.5rem;

			input {
				color: #f0f0f0;
				background-color: transparent;
				border: 0px solid #e5e5e5;
				box-sizing: border-box;
				width: 100%;

				outline: none;
			}

			button {
				text-wrap: nowrap;
				padding: 0.25rem 8px;
				background-image: linear-gradient(to bottom right, #ff0000, #aa0000);
				border-radius: 0.375rem;
				border: 0px solid transparent;
				cursor: pointer;
			}
		}
	}

	@media screen and (max-width: 700px) {
		.configuration {
			width: 100%;
			margin: 0 2rem;
		}
	}
</style>
