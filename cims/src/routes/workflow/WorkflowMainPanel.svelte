<script lang="ts">
    import WorkflowPhase from "../../lib/WorkflowPhase.svelte";

    let activePhase = $state("Prework");
    let phases = ["Prework", "Review and Approval", "Signing and Activation", "Postwork"];


    function onHeaderClick(phase: string) {
        activePhase = phase;
    }
</script>

<div class="phases-root">
    <div class="phase-header">
        <button onclick={() => {onHeaderClick(phases[0])}}>
            {phases[0]}
        </button>
    </div>
    <div class="phase-header">
        <button onclick={() => {onHeaderClick(phases[1])}}>
            {phases[1]}
        </button>
    </div>
    <div class="phase-header">
        <button onclick={() => {onHeaderClick(phases[2])}}>
            {phases[2]}
        </button>
    </div>
    <div class="phase-header">
        <button onclick={() => {onHeaderClick(phases[3])}}>
            {phases[3]}
        </button>
    </div>
    
    {#if activePhase==phases[0]}
        <div class="active-phase">
            <WorkflowPhase phase={phases[0]}/>
        </div>
    {:else if activePhase==phases[1]}
        <div class="active-phase">
            <WorkflowPhase phase={phases[1]}/>
        </div>
    {:else if activePhase==phases[2]}
        <div class="active-phase">
            <WorkflowPhase phase={phases[2]}/>
        </div>
    {:else if activePhase==phases[3]}
        <div class="active-phase">
            <WorkflowPhase phase={phases[3]}/>
        </div>
    {/if}
</div>

<style>
    .phases-root {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: 1fr 10fr;
        gap: 1em;

        outline: 5px solid red;
    }

    .active-phase {
        outline: 2px solid blue;
        
        grid-column: 1 / 5;
    }

    .phase-header {
        text-align: center;
        outline: 2px solid green;
    }
</style>