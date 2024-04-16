<script>
	/**
	 * @type {{ initial: boolean, thumbnail: string, channelLogo: string, title: string, channel: string, views: string, time: string, duration: string }}
	 */
	export let data;

	/**
	 * @type {{ initial: boolean, displayChannel: boolean, duration: number, displayMeta: boolean, theme: string }}
	 */
	export let config;
</script>

<div class="design">
	<div class="youtube-card {config.theme}">
		<div class="thumbnail" style="background-image: url({data.thumbnail})">
			{#if data.duration}
				<div class="duration">{data.duration}</div>
			{/if}

			{#if config.duration > 0}
				<div class="navigation" style="--progress: {config.duration}%"></div>
			{/if}
		</div>
		<div class="info">
			{#if config.displayChannel}
				<img src={data.channelLogo} alt="youtube channel logo" />
			{/if}
			<div>
				<h3>{data.title}</h3>
				{#if config.displayMeta}
					<div class="meta">
						{#if config.displayChannel}
							<span>{data.channel}</span>
						{/if}
						<span>{data.views} vues • {data.time}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.design {
		background-color: red;
		display: flex;
		flex-direction: column;

		background: repeating-conic-gradient(#131317 0% 25%, #232330 0% 50%);
		background-size: 25px 25px;
		align-items: center;
		justify-content: center;
		border-radius: 0.75rem;
		padding: 5rem;

		.youtube-card {
			transition: all 0.3s;
			max-width: min(100%, 400px);
			background-color: white;
			border-radius: 1rem;
			box-shadow:
				0 0 #0000,
				0 0 #0000,
				0 1px 3px 0 rgba(0, 0, 0, 0.1),
				0 1px 2px -1px rgba(0, 0, 0, 0.1);
			padding: 1rem;
			min-width: min(100%, 350px);

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
				border-radius: 0.5rem;
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
					border-radius: 4px;
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
					font-size: 1rem;
					line-height: 1.5rem;
					font-weight: 400;

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
				}

				h3 {
					margin: 12px 0 4px 0;
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

		.white {
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
</style>
