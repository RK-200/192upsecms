<script lang="ts">
    import WorkflowMainPanel from "./WorkflowMainPanel.svelte";
    import { Pencil, Check } from 'lucide-svelte';

    let {data} = $props();
    let {workflows} = data;

    let activeWorkflow = $state(workflows[0]); 
    let activeWorkflowId = $derived(activeWorkflow.id);
    let displayedWorkflowName = $state(activeWorkflow.name);

    //let workflowList = $state("New Workflow"); // temporarily not a list yet
    let isEditing = $state(false);

    function startEditing() {
        isEditing = true;
    }

    function saveName() {
         if (displayedWorkflowName.trim() !== "") {
                //isEditing = false;
            }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') {
            saveName()
        }
    }

    function switchActiveContract(newName: string) {
        console.log(workflows);
        activeWorkflow = workflows.find(item => item.name === newName) || workflows[0];
        displayedWorkflowName = activeWorkflow.name;
        console.log(activeWorkflow);
    }
</script>

<div class="main-content">
    <div class="sidebar">
        <h2>Workflows</h2>
        {#each workflows as w}
            <button onclick={() => switchActiveContract(w.name)}>
                {w.name}
            </button>
        {/each}
    </div>

    <div class="workflow-area">
        
        <div class="workflow-header">
            {#if isEditing}
                <div class="edit-group">
                    <form method="POST" action="?/update_name">
                        <input type="hidden" name="workflow_id" value={activeWorkflowId}/>
                        <input 
                            type="text" 
                            name="new_name"
                            bind:value={displayedWorkflowName} 
                            onkeydown={handleKeydown}
                            class="title-input"
                            autofocus
                        />
                        <button class="action-btn save-btn" onclick={saveName}>
                            <Check size={16} strokeWidth={3} />
                            <span>Save</span>
                        </button>
                    </form>
                </div>
            {:else}
                <div class="view-group">
                    <h1 class="page-title">{displayedWorkflowName}</h1>
                    <button class="action-btn rename-btn" onclick={startEditing}>
                        <Pencil size={16} strokeWidth={2.5} />
                        <span>Rename</span>
                    </button>
                </div>
            {/if}
        </div>
    
        <WorkflowMainPanel workflow={activeWorkflow} />
    </div>
</div>

<style>
    .main-content {
        display: grid;
        grid-template-columns: 1fr 5fr;
        gap: 2rem;
        padding: 2rem;
    }
    .sidebar {
        border-right: 3px solid #e5e7eb;
    }

    .workflow-header {
        min-height: 3rem;
        margin-bottom: 1rem;
    }

    .view-group, .edit-group {
        display: flex;
        align-items: center;
        gap: 1.5rem;
    }

    .page-title {
        font-family: 'Poppins', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: #02461C;
    }
    .title-input {
        font-family: 'Poppins', sans-serif;
        font-size: 1.8rem;
        font-weight: 700;
        color: #02461C;
        padding: 0 0.5rem;
        border: 2px solid #7B1113;
        border-radius: 8px;
        outline: none;
        width: 100%;
        max-width: 350px;
    }

    .action-btn {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        border: none;
        border-radius: 9999px;
        cursor: pointer;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 13px;
        color: white;
        transition: all 0.2s;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .rename-btn {
        background-color: #7B1113;
    }
    .rename-btn:hover {
        background-color: #5a0c0e;
    }

    .save-btn {
        background-color: #035a24;
    }
    .save-btn:hover {
        background-color: #02451C;
    }
</style>