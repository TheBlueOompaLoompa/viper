<script>
    import supabase from "$lib/supabase";
    import Button from "$lib/components/Button.svelte";

    function signup() {
        location.href = '/auth/signup';
    }

    function login() {
        location.href = '/auth/login';
    }
</script>

<main class="center">
    <Button on:click={signup} text="Sign Up" style="width: 100%;"/>
    <Button on:click={login} text="Log In" style="width: 100%;"/>
</main>

<style>
    main {
        flex-direction: column;
        width: 100%;
        height: 100%;
        max-width: 300px;

        margin: auto;
    }
</style>