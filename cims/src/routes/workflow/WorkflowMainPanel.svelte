<script lang="ts">
    import WorkflowPhase from "../../lib/WorkflowPhase.svelte";
    let { workflow }: { workflow: any } = $props();

    let activePhase = $state("Prework");
    let phases = ["Prework", "Review and Approval", "Signing and Activation", "Postwork"];
</script>
<div class="phases-container">
    <div class="tab-bar">
        {#each phases as phase}
            <div 
                class="tab" 
                class:active={activePhase === phase}
            >
                {phase.toWellFormed()}
            </div>
        {/each}
    </div>
    
    <div class="content-area">
        <WorkflowPhase 
            phase={activePhase}
            onPhaseChange={(newPhase) => activePhase = newPhase}
            preworkId={workflow?.prework} 
            approvalId={workflow?.approval}
            activationId={workflow?.activation}
            postworkId={workflow?.postwork}
        />
    </div>
</div>

<style>
    .phases-container {
        border: 2px solid #dadce0;
        border-radius: 20px;
        overflow: hidden;
        background-color: #fff;
    }

    .tab {
        flex: 1;
        padding: 15px 20px;
        font-weight: 800;
        color: #7a1a1a; 
        text-align: center;
        border-right: 2px solid #dadce0;
        transition: background-color 0.3s ease, color 0.3s ease; 
    }
     .tab-bar {
        display: flex;
        font-size: 1.1rem;
        width: 100%;
        background-color: #f3f4f6;
        border-bottom: 2px solid #dadce0;
    }
    .tab:last-child {
        border-right: none;
    }
    .tab.active {
        background-color: #7a1a1a; 
        color: white;              
    }
    .content-area {
        padding: 15px 40px;
        min-height: 400px;
    }
    :global(.workflow-phase-root) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }
</style>