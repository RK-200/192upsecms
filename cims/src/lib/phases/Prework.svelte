<script lang="ts">
  let checklist = [
    { text: "Financial Obligations", done: false },
    { text: "Duration of the Agreement", done: false },
    { text: "Title", done: false },
    { text: "Authority", done: false },
    { text: "Parties involved", done: false },
    { text: "Scope of work", done: false },
    { text: "Date of Agreement", done: false },
    { text: "Contacts", done: false },
    { text: "Roles and Responsibilities", done: false },
    { text: "Payment Schedule", done: false }
  ];
</script>

<!-- CENTERED CONTENT BOX -->
<div style="max-width: 900px; margin: 0 auto; padding: 40px; background: #cffafe;">
  <h4>Set Default Requirements</h4>

  <!-- CHECKLIST (simple vertical flow) -->
  <h3>Checklist</h3>

  {#each checklist as item}
    <label>
      <input type="checkbox" bind:checked={item.done} />
      {item.text}
    </label>
    <br />
  {/each}

  <br />

  <button type="button">
    Add Field
  </button>

  <hr style="margin: 32px 0;" />

  <!-- FILE UPLOAD (same simple flow) -->
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
