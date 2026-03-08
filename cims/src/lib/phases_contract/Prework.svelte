<script lang="ts">
  type Item = { text: string; done: boolean };
  export let preworkId: string;
  let showConfirmModal = false;
  let isSaving = false;

  let checklist: Item[] = [
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

  function addField() {
    checklist = [...checklist, { text: "New Field", done: false }];
  }

  function removeField(index: number) {
    checklist = checklist.filter((_, i) => i !== index);
  }

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  let showError = false;
let errorMessage = "";

function validateBeforeConfirm() {
  const hasEmptyField = checklist.some(
    item => item.text.trim() === ""
  );

  if (hasEmptyField) {
    errorMessage = "Checklist fields cannot be empty. Please fill in or remove empty fields.";
    showError = true;
    return;
  }

  const hasCheckedItem = checklist.some(item => item.done);

  if (!hasCheckedItem) {
    errorMessage = "Please check at least one requirement before proceeding.";
    showError = true;
    return;

  }
  showConfirmModal = true;
}

function handleNext(){
	showConfirmModal = false;
	dispatch("next");
}

</script>

<div class="phase-container">
	<!-- CHECKLIST -->
	<div class="checklist-section">
		<h3>Set Default Requirements</h3>

		<div class="checklist-items">
			{#each checklist as item, i}
				<div class="checklist-row">
					<label class="custom-checkbox">
						<input type="checkbox" bind:checked={item.done} />
						<span class="checkmark"></span>
					</label>

					<input
						class="editable-text"
						type="text"
						bind:value={item.text}
					/>

					<button class="delete-btn" onclick={() => removeField(i)}>
						×
					</button>
				</div>
			{/each}
		</div>

		<div class="button-row">
			<button class="add-button-field" onclick={addField}>+ Add Field</button>
		</div>
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
	<div class="pagenav">
		<button class="next" onclick={(validateBeforeConfirm)}>Proceed to <br/> Approval and review</button>
	</div>

{#if showError}
  <div class="modal-backdrop">
    <div class="modal">
      <h4>Action Required</h4>
      <p>{errorMessage}</p>
      <button class="modal-btn" onclick={() => showError = false}>
        OK
      </button>
    </div>
  </div>
{/if}
{#if showConfirmModal}
<div class="modal-overlay">
    <div class="modal-content">
        <h3>Confirmation</h3>

        <p>
            Are you sure you want to proceed to the Review and Approval phase?
        </p>

        <div class="modal-actions">
            <button
                class="cancel-button"
                onclick={() => showConfirmModal = false}
                disabled={isSaving}
            >
                Cancel
            </button>

            <button
                class="import-button"
                onclick={handleNext}
                disabled={isSaving}
            >
                Confirm & Proceed
            </button>
        </div>
    </div>
</div>
{/if}
</div>

<style>
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

	.checklist-row {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.custom-checkbox input {
		display: none;
	}

	.checkmark {
		height: 20px;
		width: 20px;
		border: 2px solid #333;
		border-radius: 4px;
		display: inline-block;
		position: relative;
		cursor: pointer;
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

	.editable-text {
		flex: 1;
		border: 1px solid #e5e7eb;
		border-radius: 6px;
		padding: 6px 10px;
		font-size: 0.95rem;
	}

	.delete-btn {
		background: #f3f4f6;
		border: none;
		border-radius: 6px;
		padding: 4px 10px;
		cursor: pointer;
		font-weight: bold;
		color: #555;
	}

	.delete-btn:hover {
		background: #e5e7eb;
	}

	.button-row {
		display: flex;
		justify-content: flex-start;
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
	.next {
		flex: 0.14;
  background-color: #7a1a1a; /* maroon */
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 9999px; /* fully rounded pill */
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.pagenav {
  grid-column: 1 / -1;
  display: flex;
  justify-content: right;
  margin-top: 30px;
}

.next:hover {
  background-color: #5a1313;
}

.next:active {
  transform: scale(0.97);
}
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px 30px;
  border-radius: 12px;
  max-width: 360px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}

.modal h4 {
  margin-bottom: 10px;
  font-size: 1.1rem;
}

.modal p {
  font-size: 0.95rem;
  color: #555;
  margin-bottom: 20px;
}

.modal-btn {
  background: #7a1a1a;
  color: white;
  border: none;
  padding: 8px 28px;
  border-radius: 9999px;
  font-weight: bold;
  cursor: pointer;
}
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0,0,0,0.5);

    display: flex;
    justify-content: center;
    align-items: center;

    z-index: 1000;
}

.modal-content {
    background: white;
    padding: 30px;
    border-radius: 12px;
    width: 400px;

    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
    text-align: center;
}

.modal-content h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: #7a1a1a;
}

.modal-content p {
    color: #4b5563;
    margin-bottom: 25px;
    line-height: 1.5;
}

.modal-actions {
    display: flex;
    justify-content: center;
    gap: 15px;
}
</style>
