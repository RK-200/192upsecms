<script lang="ts">
    import EditContractMainPanel from "./EditContractMainPanel.svelte";
    import { Pencil, Check, Save, Loader2, Search } from 'lucide-svelte';
    import { supabase } from "$lib/supabaseInit"; 
    import { onMount } from 'svelte';
    import { contractStore } from '$lib/contractdetail';
   
    let { data } = $props();
    let { access , contracts, users, session_id} = $derived(data); 

    
    let currentPhase = $state('Prework'); 
    
    let allContracts = $state<any[]>([]);
    let searchQuery = $state('');
    let isDropdownOpen = $state(false);
    let isLoadingContract = $state(false);
    
    let filteredContracts = $derived(
        allContracts.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    
    onMount(async () => {
        const { data: contractList, error } = await supabase
            .from('contracts')
            .select('id, title, type, status')
            .order('created_at', { ascending: false });
            
        if (!error && contractList) {
            allContracts = contractList;
        }
    });

    function handleWindowClick(e: MouseEvent) {
        const target = e.target as HTMLElement;
        if (!target.closest('.search-container')) {
            isDropdownOpen = false;
        }
    }
  
    async function handleContractSelect(selectedContract: any) {
        searchQuery = selectedContract.title;
        isDropdownOpen = false;
        isLoadingContract = true;
        
        ContractName = selectedContract.title;
        Contractlist = selectedContract.title;
        
        const[preRes, appRes, actRes, postRes] = await Promise.all([
            supabase.from('contract_preworks').select('checklist').eq('contract_id', selectedContract.id).maybeSingle(),
            supabase.from('contract_approvals').select('checklist').eq('contract_id', selectedContract.id).maybeSingle(),
            supabase.from('contract_activations').select('parties').eq('contract_id', selectedContract.id).maybeSingle(),
            supabase.from('contract_postworks').select('checklist').eq('contract_id', selectedContract.id).maybeSingle()
        ]);

        const preChecklist = (preRes.data?.checklist ||[]).map((item: any) => {
            const { isCustom, ...rest } = item; return rest;
        });

        let rawAppChecklist = appRes.data?.checklist;
        let appStages = Array.isArray(rawAppChecklist) ? rawAppChecklist : (rawAppChecklist?.stages ||[]);
        const appChecklist = appStages.map((stage: any) => {
            const { isCustom, ...restStage } = stage;
            return {
                ...restStage,
                items: (restStage.items ||[]).map((item: any) => {
                    const { isCustom, ...restItem } = item; return restItem;
                })
            };
        });

        const actParties = (actRes.data?.parties ||[]).map((party: any) => {
            const { isCustom, ...rest } = party; return rest;
        });
        
        let rawPostChecklist = postRes.data?.checklist;
        let pmilestones =[];
        let ptermination = { type: "", reason: "" };

        if (Array.isArray(rawPostChecklist)) {
            pmilestones = rawPostChecklist;
        } else if (rawPostChecklist && typeof rawPostChecklist === 'object') {
            pmilestones = rawPostChecklist.milestones ||[];
            ptermination = rawPostChecklist.termination || { type: "", reason: "" };
        }

        const postChecklist = pmilestones.map((m: any) => {
            const { isCustom, ...rest } = m; return rest;
        });
        const postTermination = ptermination;

        contractStore.update(store => ({
            ...store,
            workflowId: selectedContract.id,
            prework: { checklist: preChecklist },
            approval: { stages: appChecklist },
            activation: { parties: actParties },
            postwork: { milestones: postChecklist, termination: postTermination }
        }));
        
        contractData = {
            id: selectedContract.id,
            title: selectedContract.title,
            prework: { checklist: preChecklist },
            approval: { checklist: appChecklist },
            activation: { parties: actParties },
            postwork: { 
                checklist: postChecklist,
                milestones: postChecklist,
                contractType: selectedContract.type || "Scholarship",
                contractStatus: selectedContract.status || "Active",
                terminationType: postTermination.type || "",
                reason: postTermination.reason || ""
            }
        };
        
        isLoadingContract = false;
    }
 
    let ContractName = $state("Select a Contract...");
    let Contractlist = $state("Edit Contracts");
    let isEditing = $state(false);
    let isSaving = $state(false);
    let showModal = $state(false);
    let modalTitle = $state("");
    let modalMessage = $state("");

    let contractData = $state({
        id: null as string | null,
        title: ContractName,
        prework: { checklist:[] as any },
        approval: { checklist:[] as any },
        activation: { parties:[] as any },
        postwork: { 
            checklist:[] as any,
            milestones:[] as any,
            contractType: "",
            contractStatus: "",
            terminationType: "",
            reason: ""
        }
    });

    const currentContract = $derived(
        contracts.find(c => c.id === contractData?.id)
    );

    const editors = $derived(currentContract?.editors ?? []);
    const viewers = $derived(currentContract?.viewers ?? []);

    const editorUsers = $derived(
        users.filter(u => editors.includes(u.id))
    );

    const viewerUsers = $derived(
        users.filter(u => viewers.includes(u.id))
    );

    const availableEditors = $derived(
        users.filter(u => !editors.includes(u.id))
    );

    const availableViewers = $derived(
        users.filter(u => !viewers.includes(u.id))
    );

    const isEditor = $derived(
        editorUsers.some(u => u.id === session_id)
    );

    const isViewer = $derived(
        viewerUsers.some(u => u.id === session_id)
    );

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
        if (!contractData.postwork.contractType || contractData.postwork.contractType.trim() === "") {
            modalTitle = "Action Required";
            modalMessage = "Please enter a name for the custom contract type before saving.";
            showModal = true;
            return;
        }

        isSaving = true;
        contractData.title = ContractName;

        const finalContractType = contractData.postwork.contractType;
        const finalContractStatus = contractData.postwork.contractStatus || "Active";

        try {
            let contractId = contractData.id;

            if (!contractId) throw new Error("No contract selected to update.");

            const { error } = await supabase
                .from('contracts')
                .update({ 
                    title: contractData.title,
                    type: finalContractType,
                    status: finalContractStatus
                })
                .eq('id', contractId);
            
            if (error) throw error;

            const savePhase = async (tableName: string, payload: any) => {
                const { data: existingRow, error: fetchError } = await supabase
                    .from(tableName)
                    .select('id')
                    .eq('contract_id', contractId)
                    .maybeSingle();

                if (fetchError) throw fetchError;

                if (existingRow) {
                    return supabase.from(tableName).update(payload).eq('id', existingRow.id);
                } else {
                    return supabase.from(tableName).insert({ contract_id: contractId, ...payload });
                }
            };

            const currentStore = $contractStore;

            const cleanPrework = currentStore.prework.checklist.map((item: any) => {
                const { isCustom, ...rest } = item; return rest;
            });

            const cleanApproval = currentStore.approval.stages.map((stage: any) => {
                const { isCustom, ...restStage } = stage;
                return {
                    ...restStage,
                    items: (restStage.items ||[]).map((item: any) => {
                        const { isCustom, ...restItem } = item; return restItem;
                    })
                };
            });

            const cleanActivation = currentStore.activation.parties.map((party: any) => {
                const { isCustom, ...rest } = party; return rest;
            });

            const cleanMilestones = (contractData.postwork.milestones ||[]).map((m: any) => {
                const { isCustom, ...rest } = m; return rest;
            });

            const results = await Promise.all([
                savePhase('contract_preworks', { checklist: cleanPrework }),
                savePhase('contract_approvals', { checklist: { stages: cleanApproval } }),
                savePhase('contract_activations', { parties: cleanActivation }),
                savePhase('contract_postworks', { 
                    checklist: {
                        milestones: cleanMilestones,
                        termination: {
                            type: contractData.postwork.terminationType,
                            reason: contractData.postwork.reason
                        }
                    } 
                })
            ]);

            const phasesError = results.find(res => res?.error)?.error;
            if (phasesError) throw phasesError;

            modalTitle = "Success";
            modalMessage = "Contract updated successfully!";
            showModal = true;

        } catch (error) {
            console.error("Error updating contract:", error);
            modalTitle = "Error";
            modalMessage = "Failed to update the contract. Please check the console for details.";
            showModal = true;
        } finally {
            isSaving = false;
        }
    }
</script>

<svelte:window onclick={handleWindowClick} />

{#if access !== "Workflow Manager" && access !== "Contract Manager"}
    <h1 style="text-align:center; margin-top: 4rem;">You do not have access to view this page. <br> Please contact a Workflow Manager or a Contract Manager.</h1>
{:else}
<div class="main-content">
    <div class="sidebar">
        <h2>{Contractlist}</h2>
        
        <div class="template-selector search-container">
            <label for="contract-search">Search & Select Contract:</label>
            
            <div class="search-input-wrapper">
                <Search class="search-icon" size={18} color="#6b7280" />
                <input 
                    id="contract-search"
                    type="text" 
                    placeholder="Type to search contracts..."
                    bind:value={searchQuery}
                    onfocus={() => isDropdownOpen = true}
                    disabled={currentPhase !== 'Prework'}
                    class="search-input"
                    autocomplete="off"
                />
            </div>
            
            {#if isDropdownOpen && currentPhase === 'Prework'}
                <ul class="dropdown-list">
                    {#if filteredContracts.length > 0}
                        {#each filteredContracts as contract}
                            <li>
                                <button type="button" class="dropdown-item" onclick={() => handleContractSelect(contract)}>
                                    <span class="contract-title">{contract.title}</span>
                                    <span class="contract-meta">{contract.status} • {contract.type}</span>
                                </button>
                            </li>
                        {/each}
                    {:else}
                        <li class="no-results">No contracts found.</li>
                    {/if}
                </ul>
            {/if}

            {#if currentPhase !== 'Prework'}
                <span class="locked-text">🔒 Contract selection is locked after Prework stage</span>
            {/if}

            {#if isLoadingContract}
                <span class="loading-text"><Loader2 size={14} class="spin inline-icon" /> Loading contract data...</span>
            {/if}
        </div>
        
        {#if contractData.id && isEditor}
            <div>
                <h3>Editors</h3>

                {#each editorUsers as user}
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span>{user.username}</span>
                        <form method="POST" action="?/removeEditor">
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="contractId" value={contractData.id} />
                            <button type="submit">Remove</button>
                        </form>
                    </div>
                {/each}

                <form method="POST" action="?/addEditor">
                    <input type="hidden" name="contractId" value={contractData.id} />

                    <select name="userId" required>
                        <option disabled selected value="">Add editor</option>
                        {#each availableEditors as user}
                            <option value={user.id}>{user.username}</option>
                        {/each}
                    </select>

                    <button type="submit">Add</button>
                </form>
                
                <h3>Viewers</h3>

                {#each viewerUsers as user}
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
                        <span>{user.username}</span>
                        <form method="POST" action="?/removeViewer">
                            <input type="hidden" name="userId" value={user.id} />
                            <input type="hidden" name="contractId" value={contractData.id} />
                            <button type="submit">Remove</button>
                        </form>
                    </div>
                {/each}

                <form method="POST" action="?/addViewer">
                    <input type="hidden" name="contractId" value={contractData.id} />

                    <select name="userId" required>
                        <option disabled selected value="">Add viewer</option>
                        {#each availableViewers as user}
                            <option value={user.id}>{user.username}</option>
                        {/each}
                    </select>

                    <button type="submit">Add</button>
                </form>

            </div>
        {/if}
    </div>

    {#if contractData.id && !isEditor}
        <p>You do not have editor access to this contract. Try viewing it from the View Contracts tab instead!</p>
    {:else}
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
                    {#if contractData.id}
                        <button class="action-btn rename-btn" onclick={startEditing}>
                            <Pencil size={16} strokeWidth={2.5} />
                            <span>Rename</span>
                        </button>
                    {/if}
                    
                    <button class="action-btn publish-btn" onclick={saveContractToDB} disabled={isSaving || !contractData.id}>
                        {#if isSaving}
                            <Loader2 size={16} class="spin" />
                            <span>Saving...</span>
                        {:else}
                            <Save size={16} strokeWidth={2.5} />
                            <span>Update Contract</span>
                        {/if}
                    </button>
                </div>
            {/if}
        </div>

        {#if contractData.id}
            {#key contractData.id}
                <EditContractMainPanel bind:contractData={contractData} bind:currentPhase={currentPhase} />
            {/key}
        {:else}
            <div class="empty-state">
                <p>Please search and select an existing Contract from the sidebar to edit it.</p>
            </div>
        {/if}
    </div>
    {/if}
</div>

{#if showModal}
    <div class="modal-backdrop">
        <div class="modal">
            <h4 class={modalTitle === 'Success' ? 'title-success' : 'title-error'}>
                {modalTitle}
            </h4>
            <p>{modalMessage}</p>
            <button class="modal-btn" onclick={() => showModal = false}>
                OK
            </button>
        </div>
    </div>
{/if}

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

    /* SEARCH BAR STYLES */
    .template-selector { margin-top: 2rem; display: flex; flex-direction: column; gap: 0.5rem; position: relative; }
    
    .search-input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-input { 
        padding: 10px 10px 10px 36px; 
        border-radius: 6px; 
        border: 1px solid #ccc; 
        font-family: 'Poppins', sans-serif; 
        width: 100%;
        box-sizing: border-box;
    }
    
    .search-input:disabled {
        background-color: #e5e7eb;
        color: #6b7280;
        cursor: not-allowed;
    }

    .search-icon {
        position: absolute;
        left: 10px;
        pointer-events: none;
    }

    .dropdown-list {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        border: 1px solid #d1d5db;
        border-radius: 6px;
        margin-top: 4px;
        max-height: 250px;
        overflow-y: auto;
        z-index: 50;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        padding: 0;
        list-style: none;
    }

    .dropdown-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        padding: 10px 12px;
        border: none;
        background: none;
        cursor: pointer;
        text-align: left;
        border-bottom: 1px solid #f3f4f6;
    }

    .dropdown-item:hover {
        background-color: #f9fafb;
    }

    .contract-title {
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        font-size: 0.9rem;
        color: #111827;
    }

    .contract-meta {
        font-size: 0.75rem;
        color: #6b7280;
        margin-top: 2px;
    }

    .no-results {
        padding: 12px;
        text-align: center;
        color: #6b7280;
        font-size: 0.9rem;
        font-style: italic;
    }
    
    .loading-text { font-size: 0.85rem; color: #666; font-style: italic; display: flex; align-items: center; gap: 6px; margin-top: 8px;}

    .locked-text {
        font-size: 0.8rem;
        color: #991b1b;
        font-weight: 600;
        margin-top: 4px;
    }

    .empty-state { text-align: center; color: #666; margin-top: 4rem; font-family: 'Poppins', sans-serif; }

    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .modal {
        background: white;
        padding: 30px;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    }

    .modal h4 {
        margin-top: 0;
        margin-bottom: 15px;
        font-size: 1.25rem;
    }

    .title-error { color: #7a1a1a; }
    .title-success { color: #035a24; }

    .modal p {
        font-size: 1rem;
        color: #4b5563;
        margin-bottom: 25px;
        line-height: 1.5;
    }

    .modal-btn {
        background: #0056b3;
        color: white;
        border: none;
        padding: 10px 35px;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .modal-btn:hover { background: #004494; }

    :global(.spin) { animation: spin 1s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
</style>