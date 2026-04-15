<script lang="ts">
    import WorkflowMainPanel from "./WorkflowMainPanel.svelte";
    import { Pencil, Check } from 'lucide-svelte';

    let {data} = $props();
    let {access, workflows} = data;

    let activeWorkflow = $state(workflows[0]); 
    let activeWorkflowId = $derived(activeWorkflow.id);
    let displayedWorkflowName = $state(activeWorkflow.name);

    let isEditing = $state(false);

    function startEditing() {
        isEditing = true;
    }

    // Handles updating the displayed name and exiting edit mode when dropdown changes
    function handleWorkflowChange() {
        displayedWorkflowName = activeWorkflow.name;
        isEditing = false; 
    }
</script>

{#if access !== "Workflow Manager"}
    <h1 style="text-align:center; margin-top: 4rem;">You do not have access to view this page. <br> Please contact a Workflow Manager.</h1>
{:else}
<div class="main-content">
    <div class="workflow-area">
        
        <div class="workflow-header">
            <div class="left-section">
                {#if isEditing}
                    <div class="edit-group">
                        <form method="POST" action="?/update_name" class="inline-form">
                            <input type="hidden" name="workflow_id" value={activeWorkflowId}/>
                            <input 
                                type="text" 
                                name="new_name"
                                bind:value={displayedWorkflowName} 
                                class="title-input"
                                autofocus
                            />
                            <button class="action-btn save-btn">
                                <Check size={16} strokeWidth={3} />
                            </button>
                        </form>
                    </div>
                {:else}
                    <div class="view-group">
                        <h1 class="page-title">{displayedWorkflowName}</h1>
                        <button class="action-btn rename-btn" onclick={startEditing}>
                            <Pencil size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                {/if}
            </div>

            <div class="right-section">
                <span class="workflow-label">Select Workflow:</span>
                <select 
                    class="workflow-select" 
                    bind:value={activeWorkflow} 
                    onchange={handleWorkflowChange}
                >
                    {#each workflows as w}
                        <option value={w}>{w.name}</option>
                    {/each}
                </select>
            </div>
        </div>
    
        <WorkflowMainPanel workflow={activeWorkflow} />
    </div>
</div>
{/if}

<style>
    .main-content {
        display: block; 
        max-width: 1400px;
        margin: 2rem auto;
        padding: 0 1.5rem;
    }

    .workflow-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 3rem;
        margin-bottom: 1.5rem;
    }

    .right-section {
        display: flex;
        align-items: center;
    }

    .workflow-label {
        font-family: 'Poppins', sans-serif;
        font-size: 1.1rem;
        font-weight: 700;
        color: #02461C;
        margin-right: 0.75rem;
    }

    .workflow-select {
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
        padding: 0.5rem 0.5rem;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        color: rgb(68, 68, 68);
        background-color: white;
        outline: none;
        cursor: pointer;
        font-weight: 600;
        transition: border-color 0.2s;
        
        width: 240px; 
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }

    .workflow-select:focus, .workflow-select:hover {
        border-color: #7B1113;
    }

    .inline-form {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        margin: 0;
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
        min-width: 450px;
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