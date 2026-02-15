<script lang="ts">
    let { data } = $props();
    let { contracts } = data
</script>

<h1>View Contracts Page</h1>

{#each contracts as contract}
    <div>
        {contract.id} 
        || {contract.title}
        || {contract.created_at}
        || {contract.type}
        || {contract.status}
    </div>
{/each}