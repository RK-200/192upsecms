<script lang="ts">
    import Prework from "$lib/phases_contract/Prework.svelte";
    import ReviewApproval from "$lib/phases_contract/ReviewApproval.svelte";
    import SigningActivation from "$lib/phases_contract/SigningActivation.svelte";
    import Postwork from "$lib/phases_contract/Postwork.svelte";

    export let phase: string;
</script>

<div class="phase debug-box">
    <h2 style="text-align:center">{phase}</h2>

    {#if phase === "Prework"}
        <Prework />
    {:else if phase === "Review and Approval"}
        <ReviewApproval />
    {:else if phase === "Signing and Activation"}
        <SigningActivation />
    {:else if phase === "Postwork"}
        <Postwork />
    {/if}
</div>

<style>
.phase {
    padding: 1rem;
}
.debug-box {
    /*outline: 5px solid orange;*/
}
</style>
