<script>
    import Post from '$lib/components/Post.svelte';
    import Loading from '$lib/components/Loading.svelte';
</script>

<center>
    <h2 style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 400;">Home</h2>
    <Post title="Fake post" uid="owo" username="baenz" content="Hello world" timestamp={1640589055} ></Post>
    <Post title="Fake post" uid="odwo" username="he" content="Bello world" timestamp={1640593740} ></Post>
</center>