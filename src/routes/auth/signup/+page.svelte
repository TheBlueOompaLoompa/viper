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
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if(error) {
            console.error(error);
            return;
        }

        await supabase.from('users')
            .insert([{ id: data.user?.id, username }])
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
        <input type="email" name="email" id="email" autocomplete="email" bind:value={email} on:keypress={enterSubmit}>
        <h3>Password</h3>
        <input type="password" name="password" id="password" autocomplete="new-password" bind:value={password} on:change={checkEqual} on:keypress={enterSubmit}>
        <h3>Confirm Password</h3>
        <input type="password" name="confirm password" id="confirm" autocomplete="new-password" bind:value={confirm} on:change={checkEqual} on:keypress={enterSubmit}>
        <Button on:click={signup} text="Sign Up" wide={true}/>
    </div>
</main>