<script lang="ts">
    import { onMount } from 'svelte';

    let loginWith = { google: undefined, github: undefined };

    onMount(async () => {
        const { auth } = await import('../../firebase');
        const { GoogleAuthProvider, GithubAuthProvider, signInWithPopup } = await import('firebase/auth')

        loginWith.github = function() {
            const provider = new GithubAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/userinfo.email');

            signInWithPopup(auth, provider)
            .then(result => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                localStorage.setItem('user', JSON.stringify(result.user.toJSON()));
                // The signed-in user info.
                const user = result.user.toJSON();
                document.cookie = `user=${JSON.stringify(user)};`;

                window.location.href = '/';
            }).catch(error => {
                console.log(error);
            });
        }

        loginWith.google = function() {
            const provider = new GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/userinfo.email');

            signInWithPopup(auth, provider)
            .then(result => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                localStorage.setItem('user', JSON.stringify(result.user.toJSON()));
                // The signed-in user info.
                const user = result.user.toJSON();
                //user['stsTokenManager']['accessToken'] = 'e';
                document.cookie = `user=${JSON.stringify(user)};`;

                window.location.href = '/';
                // ...
            }).catch(error => {
                console.log(error);
            });
        }
    })
</script>

<center>
    <h1>Login</h1>

    <div class="logins">
        <button on:click={loginWith.google}>Login With Google</button>
        <button on:click={loginWith.github}>Login With Github</button>
    </div>
</center>

<style>
    .logins {
        position: absolute;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        top: 0px;
        bottom: 0px;
        left: 0px;
        right: 0px;
    }

    center {
        display: block;
        min-height: 100%;
        width: 100%;
    }

    button {
        width: 70%;
        max-width: 350px;
    }
</style>