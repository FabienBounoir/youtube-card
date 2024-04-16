<script context="module">
	const icons = {
		'chevron-down': {
			viewBox: '0 0 24 24',
			fill: 'none',
			stroke: 'currentColor',
			content: `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />`
		},
		ban: {
			viewBox: '0 0 24 24',
			fill: 'none',
			stroke: 'currentColor',
			content:
				'<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>'
		}
	};
</script>

<script>
	/**
	 * @type {keyof typeof icons}
	 */
	export let name;

	$: ({ content, ...props } = icons[name] || icons.ban);
</script>

<svg {...props} {...$$restProps} on:click>
	{@html content}
</svg>
