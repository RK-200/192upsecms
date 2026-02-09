<script lang="ts">
  let approvals = [
    {
      stage: "Approval Stage 1",
      items: [{ text: "Approval Item", done: false }]
    },
    {
      stage: "Approval Stage 2",
      items: []
    }
  ];

  let fileUrl = "";
</script>


<div style="max-width: 900px; margin: 0 auto; padding: 40px; background: #fffee0;">


<h3>Default Approval Checklist</h3>

{#each approvals as stage}
  <label>
    <input type="checkbox" />
    {stage.stage}
  </label>
  <br />

  {#each stage.items as item}
    <div>
      <label>
        <input type="checkbox" bind:checked={item.done} />
        {item.text}
      </label>
    </div>
  {/each}

  <button type="button">
    Add Approval Item
  </button>

  <br /><br />
{/each}

<button type="button">
  Add Stage
</button>

<hr />

<h3>Add Default Files</h3>

  <div style="border: 2px dashed #999; padding: 20px; text-align: center;">
    Drag & Drop or <u>Choose file</u> to upload
    <div style="font-size: 12px; color: #666;">
      fig, zip, pdf, png, jpeg
    </div>
  </div>

  <p style="text-align: center; color: #999;">OR</p>

  <input
    type="text"
    placeholder="Add file URL"
    style="width: 100%; margin-bottom: 8px;"
  />

  <button type="button">
    Upload
  </button>

  <div style="margin-top: 16px; text-align: right;">
    <button type="button">Cancel</button>
    <button type="button">Import</button>
  </div>
  </div>