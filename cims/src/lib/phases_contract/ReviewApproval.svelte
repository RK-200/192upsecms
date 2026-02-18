<script lang="ts">
	type ApprovalItem = { text: string; done: boolean };
	type Stage = { name: string; items: ApprovalItem[] };

	let stages: Stage[] = [
		{
			name: "Approval Stage 1",
			items: [{ text: "Approval Item", done: false }]
		}
	];

	function addStage() {
		stages = [...stages, { name: "New Stage", items: [] }];
	}

	function removeStage(index: number) {
		stages = stages.filter((_, i) => i !== index);
	}

	function addItem(stageIndex: number) {
		stages[stageIndex].items = [
			...stages[stageIndex].items,
			{ text: "New Item", done: false }
		];
		stages = [...stages];
	}

	function removeItem(stageIndex: number, itemIndex: number) {
		stages[stageIndex].items = stages[stageIndex].items.filter(
			(_, i) => i !== itemIndex
		);
		stages = [...stages];
	}
</script>

<div class="phase-container">
	<div class="checklist-section">
		<h3>Default Approval Checklist</h3>

		{#each stages as stage, si}
			<div class="stage-box">
				<div class="checklist-row">
					<input
						class="editable-text"
						type="text"
						bind:value={stage.name}
					/>
					<button class="delete-btn" on:click={() => removeStage(si)}>
						×
					</button>
				</div>

				<div class="nested-items">
					{#each stage.items as item, ii}
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

							<button
								class="delete-btn"
								on:click={() => removeItem(si, ii)}
							>
								×
							</button>
						</div>
					{/each}

					<button
						class="add-button-field"
						on:click={() => addItem(si)}
					>
						+ Add Approval Item
					</button>
				</div>
			</div>
		{/each}

		<button class="add-button-field" on:click={addStage}>
			+ Add Stage
		</button>
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

<style>
	.phase-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		font-family: sans-serif;
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

	h3 {
		font-size: 1rem;
		margin-bottom: 20px;
		font-weight: bold;
	}

	.checklist-section {
		display: flex;
		flex-direction: column;
		gap: 20px;
	}

	.stage-box {
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.nested-items {
		padding-left: 30px;
		display: flex;
		flex-direction: column;
		gap: 12px;
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

	.add-button-field {
		background-color: #7a1a1a;
		color: white;
		border: none;
		padding: 10px 24px;
		border-radius: 50px;
		font-weight: bold;
		cursor: pointer;
		width: fit-content;
	}

	.drop-zone {
		border: 1px dashed #d1d5db;
		border-radius: 12px;
		padding: 30px;
		text-align: center;
		background: #f9fafb;
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
</style>
