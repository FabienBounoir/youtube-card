<script>
	export let fontSize = 16;
	export let value = true;

	const uniqueID = Math.floor(Math.random() * 100);

	function handleClick(event) {
		const target = event.target;

		const state = target.getAttribute('aria-checked');

		value = state === 'true' ? false : true;
	}

	const slugify = (str = '') => str.toLowerCase().replace(/ /g, '-').replace(/\./g, '');
</script>

<div class="s s--slider" style="font-size:{fontSize}px">
	<button
		role="switch"
		aria-checked={value}
		aria-labelledby={`switch-${uniqueID}`}
		on:click={handleClick}
	>
	</button>
</div>

<style>
	button {
		cursor: pointer;
	}

	.s--slider {
		display: flex;
		align-items: center;
	}

	.s--slider button {
		width: 2.7em;
		height: 1.27em;
		position: relative;
		margin: 0 0 0 0.5em;
		background: #ccc;
		border: none;
	}

	.s--slider button::before {
		content: '';
		position: absolute;
		width: 1em;
		height: 1em;
		background: #fff;
		top: 0.13em;
		right: 1.5em;
		transition: transform 0.3s;
	}

	.s--slider button[aria-checked='true'] {
		background-color: #ff0000;
	}

	.s--slider button[aria-checked='true']::before {
		transform: translateX(1.3em);
		transition: transform 0.3s;
	}

	.s--slider button:focus {
		box-shadow: 0 0px 0px 1px #ff0000;
	}

	/* Multi Design Option */

	/* Based on suggestions from Sara Soueidan https://www.sarasoueidan.com/blog/toggle-switch-design/
    and this example from Scott O'hara https://codepen.io/scottohara/pen/zLZwNv */

	.s--multi .group-container {
		border: none;
		padding: 0;
		white-space: nowrap;
	}

	.s--multi label {
		display: inline-block;
		line-height: 1.6;
		position: relative;
		z-index: 2;
	}

	.s--multi input {
		opacity: 0;
		position: absolute;
	}

	.s--multi label:first-of-type {
		padding-right: 5em;
	}

	.s--multi label:last-child {
		margin-left: -5em;
		padding-left: 5em;
	}

	.s--multi:focus-within label:first-of-type:after {
		box-shadow: 0 0px 8px #ff0000;
		border-radius: 1.5em;
	}

	/* making the switch UI.  */
	.s--multi label:first-of-type:before,
	.s--multi label:first-of-type:after {
		content: '';
		height: 1.25em;
		overflow: hidden;
		pointer-events: none;
		position: absolute;
		vertical-align: middle;
	}

	.s--multi label:first-of-type:before {
		border-radius: 100%;
		z-index: 2;
		position: absolute;
		width: 1.2em;
		height: 1.2em;
		background: #fff;
		top: 0.2em;
		right: 1.2em;
		transition: transform 0.3s;
	}

	.s--multi label:first-of-type:after {
		background: #ff0000;
		border-radius: 1em;
		margin: 0 1em;
		transition: background 0.2s ease-in-out;
		width: 3em;
		height: 1.6em;
	}

	.s--multi input:first-of-type:checked ~ label:first-of-type:after {
		background: #ccc;
	}

	.s--multi input:first-of-type:checked ~ label:first-of-type:before {
		transform: translateX(-1.4em);
	}

	.s--multi input:last-of-type:checked ~ label:last-of-type {
		z-index: 1;
	}

	.s--multi input:focus {
		box-shadow: 0 0px 8px #ff0000;
		border-radius: 1.5em;
	}

	/* gravy */

	/* Inner Design Option */
	[role='switch'][aria-checked='true'] :first-child,
	[role='switch'][aria-checked='false'] :last-child {
		border-radius: 0.25em;
		background: #ff0000;
		display: inline-block;
	}

	.s--inner button:focus {
		box-shadow: 0 0px 8px #ff0000;
		border-radius: 0.1em;
	}

	/* Slider Design Option */
	.s--slider button {
		border-radius: 1.5em;
	}

	.s--slider button::before {
		border-radius: 100%;
	}

	.s--slider button:focus {
		box-shadow: 0 0px 0px #ff0000;
		border-radius: 1.5em;
	}
</style>
