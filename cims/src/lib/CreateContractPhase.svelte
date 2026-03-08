<script lang="ts">
    import Prework from "$lib/phases_contract/Prework.svelte";
    import ReviewApproval from "$lib/phases_contract/ReviewApproval.svelte";
    import SigningActivation from "$lib/phases_contract/SigningActivation.svelte";
    import Postwork from "$lib/phases_contract/Postwork.svelte";

        interface Props {
        phase: string;
        onPhaseChange: (phase: string) => void;

        preworkId?: any;
        approvalId?: any;
        activationId?: any;
        postworkId?: any;
    }

    let {
        phase,
        onPhaseChange,
        preworkId,
        approvalId,
        activationId,
        postworkId
    }: Props = $props();

    function changePhase(p: string) {
        onPhaseChange(p);
    }
</script>

<div class="phase">

<h2 style="text-align:center">{phase}</h2>

{#if phase === "Prework"}

    <Prework
        {preworkId}
        on:next={() => changePhase("Review and Approval")}
    />

{:else if phase === "Review and Approval"}

    <ReviewApproval
        {approvalId}
        on:back={() => changePhase("Prework")}
        on:next={() => changePhase("Signing and Activation")}
    />

{:else if phase === "Signing and Activation"}

    <SigningActivation
        {activationId}
        on:back={() => changePhase("Review and Approval")}
        on:next={() => changePhase("Postwork")}
    />

{:else if phase === "Postwork"}

    <Postwork
        {postworkId}
        on:back={() => changePhase("Signing and Activation")}
    />

{/if}

</div>

<style>
.phase {
    /*padding: 1rem;*/
}
/*.debug-box {
    outline: 5px solid orange;
}*/
</style>
