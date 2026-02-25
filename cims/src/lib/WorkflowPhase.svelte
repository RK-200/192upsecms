<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Prework from "$lib/phases_workflow/Prework.svelte";
    import ReviewApproval from "$lib/phases_workflow/ReviewApproval.svelte";
    import SigningActivation from "$lib/phases_workflow/SigningActivation.svelte";
    import Postwork from "$lib/phases_workflow/Postwork.svelte";

    export let phase: string;

    const dispatch = createEventDispatcher();

    function forwardProgress(event) {
        dispatch("progress", event.detail);
    }
</script>

<div class="phase">
    <h2 style="text-align:center">{phase}</h2>

    {#if phase === "Prework"}
        <Prework on:progress={forwardProgress}/>
    {:else if phase === "Review and Approval"}
        <ReviewApproval on:progress={forwardProgress}/>
    {:else if phase === "Signing and Activation"}
        <SigningActivation on:progress={forwardProgress}/>
    {:else if phase === "Postwork"}
        <Postwork />
    {/if}
</div>

<style>
    .phase {
        /*padding: 1rem;*/
    }
    .debug-box {
        /*outline: 5px solid orange;*/
    }
</style>
