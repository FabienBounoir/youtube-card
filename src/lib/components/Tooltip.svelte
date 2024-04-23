<script>
	export let title = '';
	let isHovered = false;
	let x;
	let y;

	function mouseOver(event) {
		isHovered = true;
		x = event.pageX + 20;
		y = event.pageY + 20;
	}
	function mouseMove(event) {
		x = event.pageX + 20;
		y = event.pageY + 20;
	}
	function mouseLeave() {
		isHovered = false;
	}
</script>

<div on:mouseover={mouseOver} on:mouseleave={mouseLeave} on:mousemove={mouseMove}>
	<slot />
</div>

{#if isHovered}
	<div style="top: {y}px; left: {x}px;" class="tooltip">{title}</div>
{/if}

<style>
	.tooltip {
		border: 1px solid rgb(38 38 38);
		background: rgb(44, 44, 44);
		border-radius: 4px;
		padding: 4px;
		position: absolute;
	}
</style>
