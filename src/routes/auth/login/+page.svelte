<script lang="ts">
    import supabase from "$lib/supabase";
    import Button from '../../../lib/components/Button.svelte';

    let email = '';
    let password = '';

    async function signin() {
        await supabase.auth.signInWithPassword({
            email,
            password
        });

        location.href = '/';
    }

    function enterSubmit(e: KeyboardEvent) {
        if(e.key == 'Enter') signin();
    }
</script>

<main>
    <div>
        <h3>Email</h3>
        <input type="email" name="email" id="email" autocomplete="email" bind:value={email} on:keypress={enterSubmit}>
        <h3>Password</h3>
        <input type="password" name="password" id="password" autocomplete="current-password" bind:value={password} on:keypress={enterSubmit}>
    </div>
    <Button on:click={signin} text="Log In" wide={true}/>
</main>