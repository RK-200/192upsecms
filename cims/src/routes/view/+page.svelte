<script lang="ts">
    import {
        blur,
        crossfade,
        draw,
        fade,
        fly,
        scale,
        slide
    } from 'svelte/transition';
    import { 
        flip
    } from 'svelte/animate';
    import { goto, invalidateAll } from '$app/navigation';
    import { page } from '$app/stores';
    import { SquareChevronUp, SquareChevronDown } from 'lucide-svelte';
    import { supabase } from "$lib/supabaseInit"; 

    let { data } = $props();
    let { contracts, filters } = $derived(data); 

    let showConfirmModal = $state(false);
    let isUpdating = $state(false);
    let targetContract = $state<any>(null);
    let pendingStatus = $state("");

    let currentSort = $derived($page.url.searchParams.get('sort') || 'title-asc');
    let sortKey = $derived(currentSort.split('-')[0]);
    let sortAsc = $derived(currentSort.split('-')[1] === 'asc');

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
</script>


<div class="main-content">
    <div class="header">
        <h1 class="page-title">Contract Records List</h1>
        <div class="controls">
            <div class="search-wrapper">
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
                <option value="Memorandum of Agreement">MOA</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Donation">Donations</option>
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

    <table>
        <thead>
            <tr>
                {#each ['title', 'created_at', 'type', 'status'] as column}
                    <th onclick={() => updateSort(column)} style="cursor: pointer;">
                        <div style="display: flex; align-items: center; gap: 6px;">
                            {column === 'created_at' ? 'CREATED AT' : column.toUpperCase()}
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
            {#each contracts as contract (contract.id)}
                <tr in:fade animate:flip={{duration: 450}}>
                    <td>{contract.title}</td>
                    <td>{new Date(contract.created_at).toLocaleDateString()}</td>
                    <td>{contract.type}</td>
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
        </tbody>
    </table>
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

<style>
    :global(body) {
        font-family: 'Poppins', sans-serif;
    }
    .main-content {
        display: grid;
        gap: 2rem;
        padding: 2rem;
    }

    table { width: 100%; 
            border-collapse: collapse;
            table-layout: fixed;
     }
    th { text-align: left; border-bottom: 2px solid #eee; padding: 12px; }
    td { padding: 12px; border-bottom: 1px solid #eee;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap; }
    
    th:nth-child(1), td:nth-child(1) { width: 45%; }
    th:nth-child(2), td:nth-child(2) { width: 15%; }
    th:nth-child(3), td:nth-child(3) { width: 25%; }
    th:nth-child(4), td:nth-child(4) { width: 25%; }

    .status-dropdown {
        border: none;
        background: transparent;
        font-family: 'Poppins', sans-serif;
        font-weight: 600;
        cursor: pointer;
        outline: none;
        padding: 4px 8px;
        border-radius: 4px;
    }

    .status-active { color: #000000; }
    .status-completed { color: #000000; }
    .status-terminated { color: #000000; }
    .status-hold { color: #000000; }

    .modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        display: flex; justify-content: center; align-items: center;
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
    .status-highlight { font-weight: bold; color: #7a1a1a; }

    .modal-actions {
        display: flex;
        justify-content: center;
        gap: 15px;
        margin-top: 25px;
    }

    .btn-cancel {
        background: #eee;
        border: none;
        padding: 10px 25px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }

    .btn-confirm {
        background: #7a1a1a;
        color: white;
        border: none;
        padding: 10px 25px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: bold;
    }

    .header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
    .page-title { font-size: 2rem; font-weight: 700; color: #02461C; margin: 0; }
    .controls { display: flex; align-items: center; gap: 0.75rem; }
    .search-input, .filter-select {
        padding: 10px; border: 1px solid #ccc; border-radius: 8px; font-size: 0.9rem;
    }
    .search-input { width: 350px; }
</style>