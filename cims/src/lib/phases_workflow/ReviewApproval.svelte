<script lang="ts">
import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

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


<div class="phase-container">
	<!-- CHECKLIST -->
	<div class="checklist-section">
		<h3>Default Approval Checklist</h3>
		
		<div class="approval-hierarchy">
			{#each approvals as stage}
				<div class="stage-group">
					<label class="custom-checkbox stage-label">
						<input type="checkbox" />
						<span class="checkmark"></span>
						{stage.stage}
					</label>

					<div class="nested-items">
						{#each stage.items as item}
							<label class="custom-checkbox item-label">
								<input type="checkbox" bind:checked={item.done} />
								<span class="checkmark"></span>
								{item.text}
							</label>
						{/each}
						<button class="small-pill-button">Add Approval Item</button>
					</div>
				</div>
			{/each}
		</div>

		<button class="large-pill-button">Add Stage</button>
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

		<div class="divider"><span>OR</span></div>

		<p class="input-label">Import from URL</p>
		<div class="url-input-container">
			<input type="text" placeholder="Add file URL" bind:value={fileUrl} />
			<button class="upload-text-button">Upload</button>
		</div>

		<div class="action-footer">
			<button class="cancel-button">Cancel</button>
			<button class="import-button">Import</button>
		</div>
	</div>
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
		margin-bottom: 25px;
		font-weight: bold;
		color: #000;
	}

	.approval-hierarchy {
		display: flex;
		flex-direction: column;
		gap: 30px;
		margin-bottom: 30px;
	}

	.stage-group {
		display: flex;
		flex-direction: column;
		gap: 12px;
	}

	.nested-items {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding-left: 32px; 
	}

	.custom-checkbox {
		display: flex;
		align-items: center;
		cursor: pointer;
		user-select: none;
	}

	.custom-checkbox input { display: none; }

	.checkmark {
		height: 20px;
		width: 20px;
		border: 2px solid #333;
		border-radius: 4px;
		margin-right: 12px;
		flex-shrink: 0;
		position: relative;
	}

	.custom-checkbox input:checked + .checkmark { background-color: #333; }
	.custom-checkbox input:checked + .checkmark:after {
		content: "";
		position: absolute;
		left: 6px; top: 2px;
		width: 5px; height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.stage-label { font-weight: 600; font-size: 1.05rem; }
	.item-label { font-weight: 400; font-size: 1rem; color: #4b5563; }

	.small-pill-button {
		align-self: flex-start;
		background: #7a1a1a;
		color: white;
		border: none;
		padding: 6px 16px;
		border-radius: 50px;
		font-size: 0.75rem;
		cursor: pointer;
		margin-top: 5px;
	}

	.large-pill-button {
		background: #7a1a1a;
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 50px;
		font-weight: bold;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
	}

	.upload-header { display: flex; justify-content: space-between; }
	.close-x { background: #f3f4f6; border: none; color: #999; cursor: pointer; padding: 2px 8px; border-radius: 4px;}
	
	.drop-zone {
		border: 1px dashed #d1d5db;
		background-color: #f9fafb;
		border-radius: 12px;
		padding: 30px;
		text-align: center;
		margin-bottom: 15px;
	}

	.blue-text { color: #3b00ff; font-weight: bold; cursor: pointer; }

	.divider { display: flex; align-items: center; margin: 20px 0; color: #999; font-size: 0.8rem; }
	.divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid #e5e7eb; }
	.divider span { padding: 0 10px; }

	.url-input-container {
		display: flex;
		background: #f9fafb;
		border: 1px solid #e5e7eb;
		border-radius: 8px;
		padding: 10px 15px;
		margin-bottom: 30px;
	}

	.url-input-container input { flex: 1; border: none; background: transparent; outline: none; }
	.upload-text-button { background: transparent; border: none; font-weight: 500; cursor: pointer; }

	.action-footer { display: flex; justify-content: center; gap: 15px; }
	.cancel-button { background: white; border: 1px solid #e5e7eb; padding: 10px 30px; border-radius: 8px; cursor: pointer; }
	.import-button { background: #3b00ff; color: white; border: none; padding: 10px 35px; border-radius: 8px; font-weight: bold; cursor: pointer; }
</style>