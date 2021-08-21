<script context="module">
	export function load({ error, status }) {
return {
	props: {
		status,
		error
	}
};
	}
</script>

<script>
	export let status;
	export let error;
</script>

<center>
	<h1>Error {status}</h1>
	<span>{error.message}</span>
</center>