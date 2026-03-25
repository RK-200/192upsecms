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
                {phase}
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
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        overflow: hidden;
        background-color: #fff;
    }

    .tab {
        flex: 1;
        padding: 15px 20px;
        font-weight: bold;
        color: #7a1a1a; 
        text-align: center;
        border-right: 1px solid #e5e7eb;
        transition: background-color 0.3s ease, color 0.3s ease; 
    }
     .tab-bar {
        display: flex;
        width: 100%;
        background-color: #f3f4f6;
        border-bottom: 2px solid #e5e7eb;
    }
    .tab:last-child {
        border-right: none;
    }
    .tab.active {
        background-color: #7a1a1a; 
        color: white;              
    }
    .content-area {
        padding: 40px;
        min-height: 400px;
    }
    :global(.workflow-phase-root) {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 40px;
    }
</style>