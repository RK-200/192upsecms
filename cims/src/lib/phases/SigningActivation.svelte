<script lang="ts">
    let checklist = [
        { text: "party 1", done: false },
        { text: "party 2", done: false },
        { text: "party 3", done: false }

    ];
    let notes = "";

</script>

<div style="max-width: 900px; margin: 0 auto; padding: 40px; background: #FDAA48;">

<h3>Checklist</h3>
{#each checklist as item}
    <label>
        <input type="checkbox" bind:checked={item.done} />
        {item.text}
    </label>
    <br />
{/each}

<button type="button">
    Signiture
</button>

</div>



