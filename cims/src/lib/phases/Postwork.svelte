<script lang="ts">
  let milestones = [
    { text: "Milestone 1", done: false },
    { text: "Milestone 2", done: false },
    { text: "Milestone 3", done: false }
  ];

  let terminationType = "";
  let reason = "";
</script>

<div style="max-width: 900px; margin: 0 auto; padding: 40px; background: #CBC3E3 ;">

<h3>Output Milestones</h3>

{#each milestones as m}
  <label>
    <input type="checkbox" bind:checked={m.done} />
    {m.text}
  </label>
  <br />
{/each}

<br />

<button type="button">
  Add Milestone
</button>

<hr />

<h2>Terminate Contract</h2>

<label>Nature of Termination</label>
<br />

<select bind:value={terminationType}>
  <option value="">Termination type</option>
  <option>Immediate</option>
  <option>With Notice</option>
</select>
<br /><br />
<textarea rows="4" cols="40" placeholder="Add Reasoning For Termination..." bind:value={reason}></textarea>
<br /><br />
<button type="button">
  Confirm
</button>
</div>