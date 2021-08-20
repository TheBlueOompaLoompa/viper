<script lang="ts">
    import { onMount } from 'svelte';

    let login;

    onMount(async () => {
        const { auth } = await import('../firebase');
        const { GoogleAuthProvider, signInWithPopup } = await import('firebase/auth')

        login = function() {
            const provider = new GoogleAuthProvider();

            provider.addScope('https://www.googleapis.com/auth/userinfo.email');

            signInWithPopup(auth, provider)
            .then((result) => {
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
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });
        }
    })
</script>

<button on:click={login}>Login</button>