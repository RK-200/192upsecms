<script lang="ts">
    import WorkflowPhase from "./WorkflowPhase.svelte";

    let currDisplayed = "Prework";

</script>

<div class="phases-root">
    <WorkflowPhase phase={"Prework"}/>
    <WorkflowPhase phase={"Review and Approval"}/>
    <WorkflowPhase phase={"Signing and Activation"}/>
    <WorkflowPhase phase={"Postwork"}/>
</div>

<style>
    .phases-root {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 10fr;
        gap: 1em;

        outline: 5px solid red;
    }
</style>