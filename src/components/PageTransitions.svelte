<script>
	import { fly } from 'svelte/transition';
	export let refresh = '';

	const pageIndex = {
		'/': 0,
		'/new': 1,
		'/groups': 2,
		'/dm': 3,
		'/search': 4,
		'/profile': 5,
		'/sign': 6
	};

	let currentPageIdx = pageIndex[refresh];
	let lastPageIdx = -1;

	$: {
		lastPageIdx = currentPageIdx;
		currentPageIdx = pageIndex[refresh];
		console.log(lastPageIdx, currentPageIdx);
	}
</script>

{#key refresh}
	<div style="overflow: hidden;">
		<div
			style="height: 100%; width: 100%;"
			in:fly={{ x: currentPageIdx > lastPageIdx ? 400 : -400, duration: 250 }}
			out:fly={{ x: currentPageIdx > lastPageIdx ? -400 : 400, duration: 250 }}
		>
			<slot />
		</div>
	</div>
{/key}
