<script>
	import { scale, slide } from 'svelte/transition';
	import { snacks } from '$lib/stores/snacks';
	import Icon from './Icon.svelte';

	$: if ($snacks.length > 3) snacks.remove($snacks[0]);
</script>

{#if $snacks.length}
	<ul>
		{#each $snacks as snack (snack._id)}
			<li in:slide={{ duration: 300 }} out:slide>
				<div in:scale={{ delay: 150 }} out:scale class="delete">
					<Icon name="ban" on:click={() => snacks.remove(snack)} />
				</div>
				{snack.message}
			</li>
		{/each}
	</ul>
{/if}

<style lang="scss">
	ul {
		position: fixed;
		transform-origin: bottom right;
		bottom: 0;
		right: 0;
		padding: 1em;
		max-height: 100vh;
		overflow: auto;
		list-style: none;
		width: 15em;
		z-index: 1000;
	}

	li {
		position: relative;
		margin-top: 1em;
		background-color: rgb(29, 29, 29);
		border: 1px solid currentColor;
		color: var(--primary-200);
		border-radius: 1em;
		padding: 1em;
		transform-origin: inherit;
	}

	.delete {
		cursor: pointer;
		position: absolute;
		background-color: inherit;
		padding: 0.25em;
		width: 2em;
		height: 2em;
		border-radius: 50%;

		top: 0;
		left: 0;

		transform: translate(-35%, -35%);
		transform-origin: inherit;
	}
</style>
