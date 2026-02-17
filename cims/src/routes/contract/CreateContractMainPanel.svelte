<script lang="ts">
    import WorkflowPhase from "../../lib/CreateContractPhase.svelte";

    type Phase =
        | "Prework"
        | "Review and Approval"
        | "Signing and Activation"
        | "Postwork";

    let activePhase = $state<Phase>("Prework");

    const phases: Phase[] = [
        "Prework",
        "Review and Approval",
        "Signing and Activation",
        "Postwork"
    ];

    let formData = $state<Record<Phase, any>>({
        "Prework": { title: "", description: "" },
        "Review and Approval": { reviewer: "" },
        "Signing and Activation": { signer: "" },
        "Postwork": { notes: "" }
    });

    let showWarning = $state(false);

    function validatePhase(phase: Phase) {
        const data = formData[phase];
        return Object.values(data).every(
            (value) => value !== null && value.toString().trim() !== ""
        );
    }

    function tryChangePhase(nextPhase: Phase) {
        if (!validatePhase(activePhase)) {
            showWarning = true;
            return;
        }
        activePhase = nextPhase;
    }

    function nextPhase(){
        const index = phases.indexOf(activePhase);
        if(index < phases.length -1){
            activePhase = phases[index+1];
        }
    }
    
    function prevPhase() {
        const index = phases.indexOf(activePhase);
        if (index > 0) {
            activePhase = phases[index - 1];
  }
}

    function closeWarning() {
        showWarning = false;
    }
</script>

<div class="phases-container">
    <div class="tab-bar">
        {#each phases as phase}
            <button class="tab-button {activePhase === phase ? 'active' : ''}" on:click={() => tryChangePhase(phase)}>
                {phase}
            </button>
        {/each}
    </div>
    
    <div class="content-area">
        <!-- Pass form state + active phase -->
        <WorkflowPhase phase={activePhase} bind:formData={formData[activePhase]}/>
    </div>
</div>

{#if showWarning}
<div class="popup-overlay">
    <div class="popup">
        <h3>Incomplete Stage</h3>
        <p>Please complete all required fields before moving to the next stage.</p>
        <button on:click={closeWarning}>OK</button>
    </div>
</div>
{/if}

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

    /* Popup */
    .popup-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .popup {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        text-align: center;
        max-width: 300px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }

    .popup button {
        margin-top: 1rem;
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        background: #7a1a1a;
        color: white;
        cursor: pointer;
    }
</style>
