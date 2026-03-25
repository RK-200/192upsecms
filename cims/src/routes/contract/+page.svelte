<script lang="ts">
    import CreateContractMainPanel from "./CreateContractMainPanel.svelte";
    import { Pencil, Check, Save, Loader2 } from 'lucide-svelte';
    import { supabase } from "$lib/supabaseInit"; 

    import { onMount } from 'svelte';
    import { getWorkflows, getWorkflowWithDetails, contractStore } from '$lib/contractdetail';
   
    let workflows = $state<any>([]);
    let selectedWorkflowId = $state('');
    let { data } = $props();
    let { access } = $derived(data); 
    
    onMount(async () => {
        const { data } = await getWorkflows();
        workflows = data || [];
    });
  
    async function handleWorkflowSelect(event: Event) {
        const target = event.target as HTMLSelectElement;
        selectedWorkflowId = target.value;
        if (!selectedWorkflowId) return;
        const workflow = await getWorkflowWithDetails(selectedWorkflowId);
        
        contractStore.update(store => ({
            ...store,
            workflowId: workflow.id,
            prework: { checklist: workflow.preworks?.prework_bridge_table?.map((item: { prework_default_reqs: { name: any; }; }) => ({text: item.prework_default_reqs.name,  done: false })) || [] },
            approval: { stages: workflow.approvals?.checklist || [] },
            activation: { parties: workflow.activations?.parties || [] },
            postwork: { milestones: workflow.postworks?.checklist || [] }
        }));
        
        const mappedPreworkChecklist = workflow.preworks?.prework_bridge_table?.map((item: any) => ({ text: item.prework_default_reqs.name, done: false })) ||[];
        
        contractData.workflow_id = selectedWorkflowId;
        contractData.prework.checklist = mappedPreworkChecklist; 
        contractData.approval.checklist = workflow.approvals?.checklist ||[];
        contractData.activation.parties = workflow.activations?.parties ||[];
        contractData.postwork.checklist = workflow.postworks?.checklist?.milestones ||[];
        contractData.postwork.milestones = workflow.postworks?.checklist?.milestones ||[];
    }
 
    let ContractName = $state("New Contract");
    let Contractlist = $state("New Contract");
    let isEditing = $state(false);
    let isSaving = $state(false);
    let isLoadingTemplate = $state(false);

    let contractData = $state({
        id: null as string | null,
        title: ContractName,
        workflow_id: "",
        prework: { checklist: {} as any },
        approval: { checklist: {} as any },
        activation: { parties: {} as any },
        postwork: { 
            checklist: {} as any,
            milestones: [],
            contractType: "Scholarship",
            contractStatus: "Draft"
        }
    });

    function startEditing() { isEditing = true; }
    function saveName() {
        if (ContractName.trim() !== "") {
            Contractlist = ContractName;
            contractData.title = ContractName; 
            isEditing = false;
        }
    }
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter') saveName();
    }

    async function saveContractToDB() {
        isSaving = true;
        contractData.title = ContractName;

        const finalContractType = contractData.postwork.contractType || "Scholarship";
        const finalContractStatus = contractData.postwork.contractStatus || "Active";

        try {
            let contractId = contractData.id;

            if (!contractId) {
                // INSERT NEW CONTRACT
                const { data: newContract, error } = await supabase
                    .from('contracts')
                    .insert({ 
                        title: contractData.title, 
                        type: finalContractType, 
                        status: finalContractStatus 
                    })
                    .select('id')
                    .single();
                
                if (error) throw error;
                contractId = newContract.id;
                contractData.id = contractId; 
            } else {
                // UPDATE EXISTING CONTRACT
                const { error } = await supabase
                    .from('contracts')
                    .update({ 
                        title: contractData.title,
                        type: finalContractType,
                        status: finalContractStatus
                    })
                    .eq('id', contractId);
                
                if (error) throw error;
            }

            const savePhase = async (tableName: string, payload: any) => {
                //Check if row already exists
                const { data: existingRow, error: fetchError } = await supabase
                    .from(tableName)
                    .select('id')
                    .eq('contract_id', contractId)
                    .maybeSingle();

                if (fetchError) throw fetchError;

                if (existingRow) {
                    // Exists, Update by Primary Key ID
                    return supabase.from(tableName).update(payload).eq('id', existingRow.id);
                } else {
                    //Doesn't exist, Insert new row
                    return supabase.from(tableName).insert({ contract_id: contractId, ...payload });
                }
            };

            const results = await Promise.all([
                savePhase('contract_preworks', { checklist: contractData.prework.checklist }),
                savePhase('contract_approvals', { checklist: { stages: contractData.approval.checklist } }),
                savePhase('contract_activations', { parties: contractData.activation.parties }),
                savePhase('contract_postworks', { checklist: contractData.postwork.checklist })
            ]);

            // Check if any phases failed to save
            const phasesError = results.find(res => res?.error)?.error;
            if (phasesError) throw phasesError;

            alert("Contract saved successfully!");
        } catch (error) {
            console.error("Error saving contract:", error);
            alert("Failed to save the contract. Please check console for details.");
        } finally {
            isSaving = false;
        }
    }
</script>

{#if access !== "Workflow Manager" && access !== "Contract Manager"}
    <h1 style="text-align:center; margin-top: 4rem;">You do not have access to view this page. <br> Please contact a Workflow Manager or a Contract Manager.</h1>
{:else}
<div class="main-content">
    <div class="sidebar">
        <h2>Create Contracts</h2>
        <p>{Contractlist}</p>
        <!-- WORKFLOW SELECTOR -->
        <div class="template-selector">
            <label for="workflow">Select Workflow Template:</label>
            <select 
                id="workflow" 
                bind:value={selectedWorkflowId} 
                onchange={handleWorkflowSelect}
                >
                <option value="" disabled selected>Select a template...</option>
                {#each workflows as wf}
                    <option value={wf.id}>{wf.name}</option>
                {/each}
            </select>
            {#if isLoadingTemplate}
                <span class="loading-text">Loading template data...</span>
            {/if}
        </div>
    </div>

    <div class="workflow-area">
        <div class="workflow-header">
            {#if isEditing}
                <div class="edit-group">
                    <input 
                        type="text" 
                        bind:value={ContractName} 
                        onkeydown={handleKeydown}
                        class="title-input"
                    />
                    <button class="action-btn save-btn" onclick={saveName}>
                        <Check size={16} strokeWidth={3} />
                        <span>Save Title</span>
                    </button>
                </div>
            {:else}
                <div class="view-group">
                    <h1 class="page-title">{ContractName}</h1>
                    <button class="action-btn rename-btn" onclick={startEditing}>
                        <Pencil size={16} strokeWidth={2.5} />
                        <span>Rename</span>
                    </button>
                    
                    <!-- SAVE TO DATABASE BUTTON -->
                    <button class="action-btn publish-btn" onclick={saveContractToDB} disabled={isSaving || !contractData.workflow_id}>
                        {#if isSaving}
                            <Loader2 size={16} class="spin" />
                            <span>Saving...</span>
                        {:else}
                            <Save size={16} strokeWidth={2.5} />
                            <span>Save Contract</span>
                        {/if}
                    </button>
                </div>
            {/if}
        </div>

        <!-- PASS STATE TO MAIN PANEL -->
        {#if contractData.workflow_id}
            <CreateContractMainPanel bind:contractData={contractData} />
        {:else}
            <div class="empty-state">
                <p>Please select a Workflow Template from the sidebar to begin.</p>
            </div>
        {/if}
    </div>
</div>
{/if}

<style>
    .main-content {
        display: grid;
        grid-template-columns: 1fr 5fr;
        gap: 2rem;
        padding: 2rem;
    }
    .sidebar { border-right: 3px solid #e5e7eb; padding-right: 1.5rem; }
    .workflow-header { min-height: 3rem; margin-bottom: 1rem; }
    .view-group, .edit-group { display: flex; align-items: center; gap: 1.5rem; }
    
    .page-title {
        font-family: 'Poppins', sans-serif; font-size: 2rem; font-weight: 700; margin: 0; color: #02461C;
    }
    .title-input {
        font-family: 'Poppins', sans-serif; font-size: 1.8rem; font-weight: 700; color: #02461C;
        padding: 0 0.5rem; border: 2px solid #7B1113; border-radius: 8px; outline: none; width: 100%; max-width: 350px;
    }
    .action-btn {
        display: flex; align-items: center; gap: 8px; padding: 8px 16px; border: none; border-radius: 9999px;
        cursor: pointer; font-family: 'Poppins', sans-serif; font-weight: 600; font-size: 13px; color: white;
        transition: all 0.2s; box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }

    .rename-btn { background-color: #7B1113; }
    .rename-btn:hover { background-color: #5a0c0e; }
    .save-btn { background-color: #035a24; }
    .save-btn:hover { background-color: #02451C; }
    .publish-btn { background-color: #0056b3; margin-left: auto; }
    .publish-btn:hover { background-color: #004494; }

    .template-selector { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.5rem; }
    .template-selector select { padding: 8px; border-radius: 6px; border: 1px solid #ccc; font-family: 'Poppins', sans-serif; }
    .loading-text { font-size: 0.85rem; color: #666; font-style: italic; }
    .empty-state { text-align: center; color: #666; margin-top: 4rem; font-family: 'Poppins', sans-serif; }
    
    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
</style>