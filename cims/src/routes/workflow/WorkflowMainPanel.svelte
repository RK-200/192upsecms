<script lang="ts">
    import WorkflowPhase from "../../lib/WorkflowPhase.svelte";

    let activePhase = $state("Prework");
    let phases = ["Prework", "Review and Approval", "Signing and Activation", "Postwork"];


    function onHeaderClick(phase: string) {
        activePhase = phase;
    }
</script>

<div class="phases-container">
    <div class="tab-bar">
        {#each phases as phase}
            <button 
                class="tab-button {activePhase === phase ? 'active' : ''}" 
                onclick={() => onHeaderClick(phase)}
            >
                {phase}
            </button>
        {/each}
    </div>
    
    <div class="content-area">
        <WorkflowPhase phase={activePhase}/>
    </div>
</div>


<style>

    .phases-container {
        border: 2px solid #e5e7eb;
        border-radius: 20px;
        overflow: hidden;
        background-color: #fff;
    }

    .tab-bar {
        display: flex;
        background-color: #f3f4f6;
        border-bottom: 2px solid #e5e7eb;
    }

    .tab-button {
        flex: 1;
        padding: 15px 10px;
        border: none;
        background: transparent;
        font-size: 16px;
        font-weight: bold;
        color: #7a1a1a; 
        cursor: pointer;
        border-right: 1px solid #e5e7eb;
        transition: all 0.2s;
    }

    .tab-button:last-child {
        border-right: none;
    }

    .tab-button.active {
        background-color: #7a1a1a; 
        color: white;
        box-shadow: inset 0 -4px 0 rgba(0,0,0,0.1);
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