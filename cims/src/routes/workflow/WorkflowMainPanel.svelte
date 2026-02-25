<script lang="ts">
    import WorkflowPhase from "../../lib/WorkflowPhase.svelte";

    type Phase =
        | "Prework"
        | "Review and Approval"
        | "Signing and Activation"
        | "Postwork";
    let activePhase = $state<Phase>("Prework");

    let phases: Phase[] = [
        "Prework",
        "Review and Approval",
        "Signing and Activation",
        "Postwork"
    ];

    let progressMap = $state<Record<Phase, number>>({
        "Prework": 0,
        "Review and Approval": 0,
        "Signing and Activation": 0,
        "Postwork": 0
    });

    let showPopup = $state(false);
    let popupMessage = $state("");

    function onHeaderClick(phase: Phase) {

            if (phase !== activePhase && activePhase !== "Postwork" && activePhase !== "Review and Approval") {
                const currentCount = progressMap[activePhase] ?? 0;
                if (currentCount < 1) {
                    popupMessage = `${activePhase} phase is incomplete. Please check at least 1 items.`;
                    showPopup = true;
                    return;
                }
            }
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
        <WorkflowPhase 
            phase={activePhase}
            on:progress={(e) => {
                progressMap[e.detail.phase as Phase] = e.detail.checkedCount;
            }}
        />

        {#if showPopup}
        <div class="modal-overlay">
            <div class="modal-box">
                <h3>Phase Incomplete</h3>
                <p>{popupMessage}</p>
                <button onclick={() => showPopup = false}>OK</button>
            </div>
        </div>
        {/if}
    </div>
</div>

<style>
.modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
}

.modal-box {
    background: white;
    padding: 30px 40px;
    border-radius: 12px;
    text-align: center;
}

.modal-box button {
    margin-top: 15px;
    padding: 8px 20px;
    border: none;
    background-color: #7a1a1a;
    color: white;
    border-radius: 6px;
    cursor: pointer;
}

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
</style>