<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { SquareChevronUp, SquareChevronDown } from 'lucide-svelte';

    let { data } = $props();
    let { contracts, filters } = $derived(data); 

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

            <select 
                class="filter-select" 
                value={filters.year} 
                onchange={(e) => updateFilter('year', e.currentTarget.value)}
            >
                <option value="All">Year</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
            </select>

            <select 
                class="filter-select" 
                value={filters.type} 
                onchange={(e) => updateFilter('type', e.currentTarget.value)}
            >
                <option value="All">Type</option>
                <option value="Memorandum of Agreement">MOA</option>
                <option value="Scholarship">Scholarship</option>
                <option value="Donation">Donations</option>
            </select>

            <select 
                class="filter-select" 
                value={filters.status} 
                onchange={(e) => updateFilter('status', e.currentTarget.value)}
            >
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
            {#each contracts as contract}
                <tr>
                    <td>{contract.title}</td>
                    <td>{new Date(contract.created_at).toLocaleDateString()}</td>
                    <td>{contract.type}</td>
                    <td>{contract.status}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    :global(body) {
        font-family: 'Poppins', sans-serif;
    }
    .main-content {
        display: grid;
        gap: 2rem;
        padding: 2rem;
    }
    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
    }
    .page-title {
        font-family: 'Poppins', sans-serif;
        font-size: 2rem;
        font-weight: 700;
        margin: 0;
        color: #02461C;
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

    .search-input {
        padding: 10px 14px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        outline: none;
        width: 350px;
        transition: border-color 0.2s;
        top: 50%;
    }

    .search-input:focus {
        border-color: #02461C;
    }

    .filter-select {
        padding: 10px 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: white;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        color: #333;
        cursor: pointer;
        outline: none;
    }

    .filter-select:focus {
        border-color: #02461C;
    }
</style>
