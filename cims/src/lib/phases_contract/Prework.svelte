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

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function next() {
    dispatch("next");
  }
</script>

<div class="phase-container">
	<!-- CHECKLIST -->
	<div class="checklist-section">
		<h3>Set Default Requirements</h3>
		<div class="checklist-items">
			{#each checklist as item}
				<label class="custom-checkbox">
					<input type="checkbox" bind:checked={item.done} />
					<span class="checkmark"></span>
					{item.text}
				</label>
			{/each}
		</div>
		<button class="add-button-field">Add Field</button>
	</div>

	<!-- FILE UPLOAD -->
	<div class="upload-section">
		<div class="upload-header">
			<h3>Add Default Files</h3>
			<button class="close-x">×</button>
		</div>

		<div class="drop-zone">
			<p>Drag & Drop or <span class="blue-text">Choose file</span> to upload</p>
		</div>

		<div class="divider">
			<span>OR</span>
		</div>

		<p class="input-label">Import from URL</p>
		<div class="url-input-container">
			<input type="text" placeholder="Add file URL" />
			<button class="upload-text-button">Upload</button>
		</div>

		<div class="action-footer">
			<button class="cancel-button">Cancel</button>
			<button class="import-button">Import</button>
		</div>
	</div>
</div>
<div class="nav-buttons">
  <button class="pill-button" on:click={next}>Next</button>
</div>



<style>
	.nav-buttons {
		display: flex;
		justify-content: flex-end;
		gap: 12px;
		margin-top: 30px;
	}

	.phase-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		background: white;
		font-family: sans-serif;
	}

	h3 {
		font-size: 1rem;
		margin-bottom: 20px;
		font-weight: bold;
	}

	.checklist-items {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 25px;
	}

	.custom-checkbox {
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: 1rem;
		color: #374151;
		user-select: none;
	}

	.custom-checkbox input {
		display: none; 
	}

	.checkmark {
		height: 20px;
		width: 20px;
		border: 2px solid #333;
		border-radius: 4px;
		margin-right: 12px;
		display: inline-block;
		position: relative;
	}

	.custom-checkbox input:checked + .checkmark {
		background-color: #333;
	}

	.custom-checkbox input:checked + .checkmark:after {
		content: "";
		position: absolute;
		left: 6px;
		top: 2px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.add-button-field {
		background-color: #7a1a1a; 
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 50px;
		font-weight: bold;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
	}

	.upload-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.close-x {
		background: #f3f4f6;
		border: none;
		border-radius: 4px;
		color: #999;
		cursor: pointer;
		padding: 2px 8px;
	}

	.drop-zone {
		border: 1px dashed #d1d5db;
		background-color: #f9fafb;
		border-radius: 12px;
		padding: 30px;
		text-align: center;
		margin-bottom: 15px;
	}

	.blue-text {
		color: #3b00ff;
		text-decoration: none;
		font-weight: bold;
		cursor: pointer;
	}

	.divider {
		display: flex;
		align-items: center;
		text-align: center;
		margin: 15px 0;
		color: #999;
		font-size: 0.8rem;
	}

	.divider::before, .divider::after {
		content: '';
		flex: 1;
		border-bottom: 1px solid #e5e7eb;
	}

	.divider span {
		padding: 0 10px;
	}

	.input-label {
		font-size: 1rem;
		margin-bottom: 8px;
		color: #374151;
	}

	.url-input-container {
		display: flex;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 8px 15px;
		margin-bottom: 30px;
	}

	.url-input-container input {
		flex: 1;
		border: none;
		background: transparent;
		outline: none;
	}

	.upload-text-button {
		background: transparent;
		border: none;
		color: #333;
		cursor: pointer;
		font-weight: 500;
	}

	.action-footer {
		display: flex;
		justify-content: center;
		gap: 15px;
	}

	.cancel-button {
		background: white;
		border: 1px solid #e5e7eb;
		padding: 10px 30px;
		border-radius: 8px;
		cursor: pointer;
	}

	.import-button {
		background: #3b00ff; 
		color: white;
		border: none;
		padding: 10px 35px;
		border-radius: 8px;
		font-weight: bold;
		cursor: pointer;
	}
</style>
