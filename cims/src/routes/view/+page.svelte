<script lang="ts">
    import { onMount } from 'svelte'; 
    import { fade } from 'svelte/transition';
    import { flip } from 'svelte/animate';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import { SquareChevronUp, SquareChevronDown, Search } from 'lucide-svelte';
    import { supabase } from "$lib/supabaseInit"; 

    let { data } = $props();
    let { access, contracts, filters, users, session_id} = $derived(data); 

    const visibleContracts = $derived(
        contracts?.filter(contract =>
            contract.editors?.includes(session_id) ||
            contract.viewers?.includes(session_id)
        ) ?? []
    );

    let showConfirmModal = $state(false);
    let isUpdating = $state(false);
    let targetContract = $state<any>(null);
    let pendingStatus = $state("");
    
    let existingTypes = $state<string[]>([]);

    let currentSort = $derived($page.url.searchParams.get('sort') || 'title-asc');
    let sortKey = $derived(currentSort.split('-')[0]);
    let sortAsc = $derived(currentSort.split('-')[1] === 'asc');

    onMount(async () => {
        const { data: contractData, error } = await supabase
            .from('contracts')
            .select('type');
            
        if (contractData && !error) {
            const uniqueTypes = [...new Set(contractData.map(d => d.type).filter(Boolean))];
            existingTypes = uniqueTypes as string[];
        }
    });

    function updateFilter(key: string, value: string) {
        const newUrl = new URL(window.location.href);
        if (value === 'All' || value === '') {
            newUrl.searchParams.delete(key);
        } else {
            newUrl.searchParams.set(key, value);
        }
        goto(newUrl.toString(), { keepFocus: true, noScroll: true });
    }

    function updateSort(key: string) {
        const newUrl = new URL(window.location.href);
        let newOrder = 'asc';
        if (sortKey === key) {
            newOrder = sortAsc ? 'desc' : 'asc';
        }
        newUrl.searchParams.set('sort', `${key}-${newOrder}`);
        goto(newUrl.toString(), { keepFocus: true, noScroll: true });
    }

    function initiateStatusUpdate(contract: any, newStatus: string) {
        if (contract.status === newStatus) return;
    
        targetContract = contract;
        pendingStatus = newStatus;
        showConfirmModal = true;
    }

    async function confirmStatusUpdate() {
        if (!targetContract) return;
        isUpdating = true;

        try {
            const { error } = await supabase
                .from('contracts') 
                .update({ status: pendingStatus })
                .eq('id', targetContract.id);

            if (error) throw error;

            await invalidateAll();
            showConfirmModal = false;
        } catch (err) {
            console.error("Update failed:", err);
            alert("Failed to update status.");
        } finally {
            isUpdating = false;
        }
    }

    function formatDate(dateString: string) {
        if (!dateString) return '--';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
</script>

{#if access !== "Workflow Manager" && access !== "Contract Manager" && access !== "Contract Viewer"}
    <h1 style="text-align:center; margin-top: 4rem;">You do not have access to view this page. <br> Please contact a Workflow Manager or a Contract Manager.</h1>
{:else}
<div class="main-content">
    <div class="header">
        <h1 class="page-title">Contract Records List</h1>
        <div class="controls">
            
            <div class="search-wrapper">
                <Search class="search-icon" size={18} color="#6b7280" />
                <input 
                    type="text" 
                    placeholder="Search contracts" 
                    class="search-input"
                    value={filters.search}
                    oninput={(e) => updateFilter('search', e.currentTarget.value)}
                />
            </div>

            <select class="filter-select" value={filters.year} onchange={(e) => updateFilter('year', e.currentTarget.value)}>
                <option value="All">Year</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
            </select>

            <select class="filter-select" value={filters.type} onchange={(e) => updateFilter('type', e.currentTarget.value)}>
                <option value="All">Type</option>
                {#each existingTypes as type}
                    <option value={type}>{type}</option>
                {/each}
            </select>

            <select class="filter-select" value={filters.status} onchange={(e) => updateFilter('status', e.currentTarget.value)}>
                <option value="All">Status</option>
                <option value="Active">Active</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
                <option value="Terminated">Terminated</option>
            </select>
        </div>
    </div>

    <div class="table-container">
        <table>
            <thead>
                <tr>
                    {#each ['title', 'created_at', 'last_modified', 'type', 'status'] as column}
                        <th onclick={() => updateSort(column)} style="cursor: pointer;">
                            <div class="th-content">
                                {column === 'created_at' ? 'CREATED ON' : 
                                 column === 'last_modified' ? 'LAST MODIFIED' : 
                                 column.toUpperCase()}
                                
                                {#if sortKey === column}
                                    {#if sortAsc}
                                        <SquareChevronUp size={16} strokeWidth={2.5} />
                                    {:else}
                                        <SquareChevronDown size={16} strokeWidth={2.5} />
                                    {/if}
                                {:else}
                                    <span style="width: 16px;"></span> 
                                {/if}
                            </div>
                        </th>
                    {/each}
                </tr>
            </thead>
            <tbody>
                {#if visibleContracts.length === 0}
                    <tr>
                        <td colspan="5" style="text-align: center; color: #6b7280; padding: 2rem;">
                            No contracts found matching your filters.
                        </td>
                    </tr>
                {:else}
                    {#each visibleContracts as contract (contract.id)}
                        <tr in:fade animate:flip={{duration: 450}}>
                            <td>
                                <a href="/view/{contract.id}" class="contract-link">
                                    {contract.title}
                                </a>
                            </td>
                            <td class="date-cell">{formatDate(contract.created_at)}</td>
                            <td class="date-cell">{formatDate(contract.last_modified)}</td>
                            <td>
                                <span class="type-badge">{contract.type}</span>
                            </td>
                            <td>
                                <select 
                                    class="status-dropdown" 
                                    class:status-active={contract.status === 'Active'}
                                    class:status-completed={contract.status === 'Completed'}
                                    class:status-terminated={contract.status === 'Terminated'}
                                    class:status-hold={contract.status === 'On Hold'}
                                    value={contract.status}
                                    onchange={(e) => initiateStatusUpdate(contract, e.currentTarget.value)}
                                >
                                    <option value="Active">Active</option>
                                    <option value="On Hold">On Hold</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Terminated">Terminated</option>
                                </select>
                            </td>
                        </tr>
                    {/each}
                {/if}
            </tbody>
        </table>
    </div>
</div>

{#if showConfirmModal}
    <div class="modal-overlay">
        <div class="modal-content">
            <h3>Update Status</h3>
            <p>
                Are you sure you want to change the status of 
                <strong>"{targetContract?.title}"</strong> to 
                <span class="status-highlight">{pendingStatus}</span>?
            </p>
            
            <div class="modal-actions">
                <button 
                    class="btn-cancel" 
                    onclick={() => { showConfirmModal = false; targetContract = null; }} 
                    disabled={isUpdating}
                >
                    Cancel
                </button>
                <button 
                    class="btn-confirm" 
                    onclick={confirmStatusUpdate} 
                    disabled={isUpdating}
                >
                    {isUpdating ? 'Updating...' : 'Confirm Update'}
                </button>
            </div>
        </div>
    </div>
{/if}
{/if}

<style>
    :global(body) {
        font-family: 'Poppins', sans-serif;
        background-color: #f9fafb; 
    }

    .main-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 2rem;
        display: grid;
        gap: 2rem;
    }

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        flex-wrap: wrap;
    }

    .page-title {
        font-size: 2rem;
        font-weight: 700;
        color: #02461C;
        margin: 0;
    }

    .controls {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }

    .search-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .search-icon {
        position: absolute;
        left: 12px;
        pointer-events: none;
    }

    .search-input {
        padding: 10px 10px 10px 36px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        width: 300px;
        outline: none;
        transition: border-color 0.2s;
    }

    .search-input:focus {
        border-color: #02461C;
        box-shadow: 0 0 0 2px rgba(2, 70, 28, 0.1);
    }

    .filter-select {
        padding: 10px 14px;
        border: 1px solid #d1d5db;
        border-radius: 8px;
        background-color: white;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        color: #374151;
        cursor: pointer;
        outline: none;
    }

    .filter-select:focus {
        border-color: #02461C;
    }

    .table-container {
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    table {
        width: 100%;
        border-collapse: collapse;
        table-layout: fixed;
    }

    thead {
        background-color: #7B1113;
    }

    th {
        text-align: left;
        padding: 14px 20px;
        font-size: 0.85rem;
        font-weight: 600;
        color: #fbf9f9;
        letter-spacing: 0.05em;
        transition: background-color 0.2s;
    }

    th:hover {
        background-color: #5a0c0e;
    }

    .th-content {
        display: flex;
        align-items: center;
        gap: 6px;
    }

    tbody tr {
        border-bottom: 1px solid #e5e7eb;
        transition: background-color 0.15s;
    }

    tbody tr:last-child {
        border-bottom: none;
    }

    tbody tr:hover {
        background-color: #f9fafb;
    }

    td {
        padding: 16px 20px;
        color: #1f2937;
        font-size: 0.95rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    th:nth-child(1), td:nth-child(1) { width: 30%; } /* Title */
    th:nth-child(2), td:nth-child(2) { width: 15%; } /* Created */
    th:nth-child(3), td:nth-child(3) { width: 15%; } /* Modified */
    th:nth-child(4), td:nth-child(4) { width: 20%; } /* Type */
    th:nth-child(5), td:nth-child(5) { width: 20%; } /* Status */

    .contract-link {
        color: #02461C;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.15s;
    }

    .contract-link:hover {
        text-decoration: underline;
        color: #7B1113;
    }

    .date-cell {
        color: #6b7280;
        font-size: 0.9rem;
    }

    .type-badge {
        color: #6b7280;
        font-weight: 600;
    }

    .status-dropdown {
        border: 1px solid transparent;
        background: transparent;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        cursor: pointer;
        outline: none;
        padding: 4px 8px;
        border-radius: 30px;
        font-size: 0.85rem;
        transition: all 0.2s;
        text-align: center;
    }

    .status-dropdown:hover {
        border-color: #d1d5db;
        background-color: white;
        color: #6b7280;
    }

    .status-active { color: #1e8e3e; background-color: #e6f4ea; }
    .status-completed { color: #1a73e8; background-color: #e8f0fe; }
    .status-terminated { color: #d93025; background-color: #fadbd8; }
    .status-hold { color: #f57c00; background-color: #fef0e0; }

    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    }

    .modal-content {
        background: white;
        padding: 30px;
        border-radius: 12px;
        width: 450px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        text-align: center;
    }

    .modal-content h3 {
        margin-top: 0;
        color: #111827;
    }

    .status-highlight {
        font-weight: bold;
        color: #7B1113;
    }

    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 25px;
    }

    .btn-cancel {
        background: #f3f4f6;
        color: #4b5563;
        border: none;
        padding: 10px 25px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;
    }

    .btn-cancel:hover:not(:disabled) {
        background: #e5e7eb;
    }

    .btn-confirm {
        background: #7B1113;
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: background 0.2s;
    }

    .btn-confirm:hover:not(:disabled) {
        background: #5a0c0e;
    }

    .btn-confirm:disabled, 
    .btn-cancel:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
</style>