<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<nav>
	<a href="/">upse image</a>
	<a href="/workflow">Create Workflow</a>
	<a href="/contract">Create Contract</a>
	<a href="/view"> View Contracts</a>
</nav>

{@render children()}
