<script>
	export let timestamp = '';

	let tmp = new Date(timestamp).toString();

	let tmp2 = tmp.split(' ');
	tmp2.splice(tmp2.length - 2, 2);

	let time = tmp2[4].split(':');

	const isAfternoon = parseInt(time[0]) >= 12;

	let hours = isAfternoon ? parseInt(tmp2[4].split(':')[0]) - 12 : parseInt(tmp2[4].split(':')[0]);
	time[0] = hours.toString();
	tmp2[4] = `${time.join(':')} ${isAfternoon ? 'PM' : 'AM'}`;

	tmp2.splice(4, 0, 'at');
	tmp2.splice(-2, 2);

	let date = tmp2.join(' ');
</script>

<div class="center" style="margin: 0px; padding: 0px; margin-top: 6px;">
	<span class="gray" style="font-size: 11.5px;">Posted on {date}</span>
</div>

<style>
	span {
		width: 97%;
	}
</style>
