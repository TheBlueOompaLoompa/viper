<script lang="ts">
	import { onMount } from "svelte";

	import { supabase } from '../supa';

	onMount(() => {
		if(!supabase.auth.session() && window.location.href != '/sign')
			window.location.href = '/sign';
	});
</script>
<slot></slot>