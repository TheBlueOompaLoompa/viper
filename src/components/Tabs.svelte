<script>
	export let tabs = [];
	export let active = tabs[0];
	export let style = '';
	export let c_class = '';

	function getSide(idx) {
		if(idx == 0) {
			return 'l';
		}else if(idx >= tabs.length - 1){
			return 'r'
		}else {
			return '';
		}
	}

	function setTab(tab) {
		active = tab;
	}
</script>

<tabs class={c_class} {style}>
	{#each tabs as tab, idx}
		<tab class={(active == tab ? 'a-tab ' + getSide(idx) : getSide(idx))} on:click={() => {setTab(tab)}}>{tab}</tab>
	{/each}
</tabs>

<style>
	tabs {
		display: flex;
	}

	tab {
		border-bottom: 4px;
		border-color: var(--theme-font-gray);
		width: 100%;
		border-style: solid;
		-webkit-user-select: none;
		user-select: none;
		-moz-user-select: none;
	}

	tab.a-tab {
		border-color: var(--theme-color-accent-mid);
	}

	tab.l {
		border-bottom-left-radius: 3px;
	}

	tab.r {
		border-bottom-right-radius: 3px;
	}
</style>