<script lang="ts">
    import supabase from "$lib/supabase";
    import Button from '../../../lib/components/Button.svelte';
    
    let username = '';
    let email = '';
    let password = '';
    let confirm = '';

    function checkEqual() {
        if(password == confirm) document.querySelectorAll('#password, #confirm').forEach((e) => e.classList.toggle('bad', false));
        else document.querySelectorAll('#password, #confirm').forEach((e) => e.classList.toggle('bad', true))
    }

    async function signup() {   
        await supabase.auth.signUp({
            email,
            password
        })
    }

    function enterSubmit(e: KeyboardEvent) {
        if(e.key == 'Enter') signup();
    }
</script>

<main>
    <div>
        <h3>Username</h3>
        <input type="text" name="username" id="username" bind:value={username} on:keypress={enterSubmit}>
        <h3>Email</h3>
        <input type="email" name="email" id="email" bind:value={email} on:keypress={enterSubmit}>
        <h3>Password</h3>
        <input type="password" name="password" id="password" bind:value={password} on:change={checkEqual} on:keypress={enterSubmit}>
        <h3>Confirm Password</h3>
        <input type="password" name="confirm password" id="confirm" bind:value={confirm} on:change={checkEqual} on:keypress={enterSubmit}>
        <Button on:click={signup} text="Sign Up" wide={true}/>
    </div>
</main>