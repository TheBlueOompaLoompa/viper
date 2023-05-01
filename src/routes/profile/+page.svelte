<script>
	import supabase from '$lib/supabase';
	import { onMount } from 'svelte';

    onMount(async () => {
        if((await supabase.auth.getSession()).data.session == null) {
            window.location.href = '/auth';
        }
    })
</script>