<script>
	import { snacks } from '$lib/stores/snacks';
	import { toPng } from 'html-to-image';

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
	const getVideoData = async (url) => {
		const videoId = findVideoId(url);
		if (!videoId) return snacks.error('Invalid youtube video URL');

		try {
			const response = await fetch(`/_api/info`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ videoId })
			});

			if (response.status !== 200) {
				snacks.error('An error occured while fetching the video data');
				return;
			}

			data = await response.json();
		} catch (error) {
			snacks.error('An error occured while fetching the video data');
		}
	};

	const download = async (e) => {
		waitingGeneration = true;
		e.target.innerText = 'Generating...';

		/**
		 * @type {HTMLElement}
		 */
		const node = document.querySelector('.youtube-card');
		const dataUrl = await toPng(node, {
			canvasWidth: node.offsetWidth * (config.size || 1),
			canvasHeight: node.offsetHeight * (config.size	|| 1),
			quality: 1
		});
		const a = document.createElement('a');
		a.href = dataUrl;
		a.download = `ytb-${data.channel}-${data.title}.png`;
		a.click();

		waitingGeneration = false;
		e.target.innerText = 'Downloaded!';

		setTimeout(() => {
			e.target.innerText = 'Download';
		}, 2000);
	};

	const copyToClipboard = (e) => {
		waitingGeneration = true;
		e.target.innerText = 'Generating...';

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
</script>

<div class="configuration">
	<div class="config">
		<h1>Card options</h1>
		<div class="input-container">
			<input
				bind:value={url}
				placeholder="Paste youtube video URL"
				on:keyup={(e) => e.key === 'Enter' && getVideoData(url)}
			/>
			<button on:click={getVideoData(url)}>Get Video <i class="fa-solid fa-arrow-right"></i></button
			>
		</div>

		<div class="config-container">
			<span>Display channel logo</span>
			<input type="checkbox" bind:checked={config.displayChannel} />
		</div>

		<div class="config-container">
			<span>Display statistics</span>
			<input type="checkbox" bind:checked={config.displayMeta} />
		</div>

		<div class="config-container">
			<span>Display duration</span>
			<input type="checkbox" bind:checked={config.displayDuration} />
		</div>

		<div class="config-container">
			<span
				>Progress {#if config.duration > 0}<span class="lenght">{config.duration}%</span>{/if}</span
			>
			<input type="range" bind:value={config.duration} min="0" max="100" />
		</div>


		<div class="config-container">
			<span>Theme</span>
			<select bind:value={config.theme}>
				<option value="dark">Dark</option>
				<option value="white">White</option>
			</select>
		</div>

		<div class="config-container">
			<span>Size <span class="lenght">x{config.size  || 1}</span></span>
			<input type="range" bind:value={config.size} min="1" max="10" step="1" />
		</div>

		<div class="button-container">
			<button on:click={copyToClipboard} disabled={waitingGeneration}>
					Copy
			</button>

			<button on:click={download} disabled={waitingGeneration}>
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
					background-color: rgb(81 4 4);
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
				background-color: rgba(38, 38, 38, 0.5);
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
