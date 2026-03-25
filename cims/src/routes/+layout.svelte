<script lang="ts">
	import upSeal from '$lib/assets/UP-Seal.png';
	import upseLogo from '$lib/assets/UPSE CMS logo.png'; 
	import { Workflow, FilePlusCorner, Search } from 'lucide-svelte';

	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'
	let { data, children } = $props()
	let { supabase, session } = $derived(data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})
		return () => data.subscription.unsubscribe()
	})
</script>

<svelte:head>
	<title>UPSE Contracts Management System</title>
	<link rel="icon" href={upSeal} />
</svelte:head>

<header class="header-container">
	<div class="logo-section">
		<a href="/">
			<img src={upseLogo} alt="UPSE CMS Logo" class="logo-img" />
		</a>
	</div>

	<nav class="nav-links">
		<a href="/workflow" class="nav-btn">
			<Workflow size={24} strokeWidth={2.5} />
			<span class="nav-btn-txt">Edit Workflows</span>
		</a>
		
		<a href="/edit-contract" class="nav-btn">
			<FilePlusCorner size={24} strokeWidth={2.5} />
			<span class="nav-btn-txt">Edit Contract</span>
		</a>

		<a href="/create-contract" class="nav-btn">
			<FilePlusCorner size={24} strokeWidth={2.5} />
			<span class="nav-btn-txt">Create Contract</span>
		</a>
		
		<a href="/view" class="nav-btn">
			<Search size={24} strokeWidth={2.5} />
			<span class="nav-btn-txt">View Contracts</span>
		</a>
	</nav>
</header>

<main>
	{@render children()}
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

    :global(body) {
        font-family: 'Poppins', sans-serif;
        margin: 0;
    }
	.header-container {
		display: flex;
		align-items: center; 
		justify-content: space-between;
		padding: 0.75rem 2.5rem;
		background-color: white;
		border-bottom: 1px solid #e5e7eb;
		box-shadow: 0 1px 3px rgba(0,0,0,0.1);
	}

	.logo-img {
		height: 80px;
		width: auto;
		display: block;
	}

	.nav-links {
		display: flex;
		flex-direction: row;
		gap: 12px;
		align-items: center;
	}

	.nav-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 20px;
		background-color: #7B1113;
		color: white;
		border-radius: 9999px;
		text-decoration: none;
		font-weight: 600;
		font-size: 13px;
		white-space: nowrap;
		transition: background-color 0.2s, transform 0.1s;
		box-shadow: 0 3px 6px rgba(0,0,0,0.1);
	}

	.nav-btn-txt {
		font-size: 18px;
	}

	.nav-btn:hover {
		background-color: #5a0c0e;
	}

	.nav-btn:active {
		transform: scale(0.96);
	}
</style>