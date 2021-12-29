<script lang="ts">
    import { themeStore } from '$lib/stores';

    const themes = [
        'Auto',
        'Dark',
        'Light'
    ];

    let first = false;

    function setTheme(theme: number) {
        themeStore.set(theme);
        localStorage.setItem('theme', theme.toString());
        // Ignore the error, linter is bugged
        setTimeout(() => {
            if(first) {
                localStorage.setItem('reload', 'true');
                window.location.reload(true);
            }
            first = true;
        }, 500)
    }

    $: setTheme(theme);

    let theme = 0;

    themeStore.subscribe(value => {
        theme = value;
    });
</script>

<h2>Theme</h2>
<inline><span>{themes[theme]}</span><input type="range" min="0" max="2" bind:value={theme}></inline>