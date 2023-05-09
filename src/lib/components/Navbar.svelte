<script lang="ts">
	export const ssr = false;
    import { Person, House, Search, PlusSquare, Chat, People, Gear } from 'svelte-bootstrap-icons';
	import { onMount } from 'svelte';
	import supabase from '$lib/supabase';
	export let page: string;

	$: console.log(page)

	onMount(async () => {
		const { data, error } = await supabase.auth.getSession()
		const profileTag = document.getElementById('profile') as unknown as HTMLAnchorElement;

		if(data.session != null && !error) {
			profileTag.setAttribute('href', `/profile?id=${data.session?.user.id}`);
		}else {
			profileTag.setAttribute('href', '/auth');
		}
	})
</script>

<nav>
	<div>
		<a id="home"     aria-label="Home" class={page == '' ? 'active' : ''}          href="/"><House/><span>Home</span></a>
		<a id="search"   aria-label="Search" class={page == 'search' ? 'active' : ''}    href="/search"><Search/><span>Search</span></a>
		<a id="groups"   aria-label="Groups" class={page == 'groups' ? 'active' : ''}    href="/groups"><People/><span>Groups</span></a>
		<a id="new"      aria-label="New" class={page == 'new' ? 'active' : ''}       href="/new"><PlusSquare/><span>New</span></a>
		<a id="dm"       aria-label="Direct Messages" class={page == 'dm' ? 'active' : ''}        href="/dm"><Chat/><span>Messages</span></a>
		<a id="profile"  aria-label="Profile" class={page == 'profile' ? 'active' : ''}	><Person/><span>Profile</span></a>
		<a id="settings" aria-label="Settings" class={page == 'settings' ? 'active' : ''}	href="/settings"><Gear/><span>Settings</span></a>
	</div>
</nav>

<style>
	nav {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

        position: fixed;
        
        bottom: 0px;

		box-shadow: 0px -2px 4px var(--theme-color-accent-mid);
		background-color: var(--theme-color-background);

		overflow: hidden;

		left: 0px;
		right: 0px;
		height: 2.5rem;
	}

    nav div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        
        width: 100%;
        max-width: 640px;
    }

	a span {
		display: none;
	}

    @media (min-width: 700px) {
        nav, nav div {
            flex-direction: column;
            width: 2.5rem;
			height: 100%;
        }

		nav {
			justify-content: start;
		}

		nav div {
			max-height: 400px;
		}
    }

	a,
	a:visited {
		display: flex;
		align-items: center;
        justify-content: center;
		height: 2rem;
		width: 2rem;
		color: #d1d5db;
		text-decoration: none;
	}

	.active {
		background-color: var(--theme-color-main);
		padding: 5px;
		width: 21px;
		height: 21px;
		border-style: solid;
		border-color: var(--theme-color-outline);
		border-width: 1px;
		border-radius: 100%;

		box-shadow: 0px 1px 4px var(--theme-color-accent-mid);
	}

	.active * {
		filter: invert(0.5);
	}

	@media (min-width: 1000px) {
		nav, nav div {
            flex-direction: column;
            left: 0px;
            width: 8rem;
            height: 100%;
        }

		.active, a {
			display: flex;
			flex-direction: row;
			width: 90%;
			border-radius: 0.4rem;
		}

		a span {
			display: inline-block;
			margin-left: .8rem;
			margin-right: auto;
		}
	}
	
	@supports (-webkit-touch-callout: none) {
		nav {
			padding-bottom: 15px;
			height: calc(2.5em + 15px);
		}
    }
</style>