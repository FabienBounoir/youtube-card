<script>
	export let title = '';
	export let disabledOnMobile = false;
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

<div
	on:mouseover={mouseOver}
	on:mouseleave={mouseLeave}
	on:mousemove={mouseMove}
	class={disabledOnMobile ? 'phoneRestricted' : ''}
>
	<slot />
</div>

{#if isHovered && window.innerWidth > 768}
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

	@media (hover: none) and (pointer: coarse) {
		.phoneRestricted {
			display: none;
		}
	}
</style>
