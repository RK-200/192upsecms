<script lang="ts">
  let milestones = [
    { text: "Milestone 1", done: false },
    { text: "Milestone 2", done: false },
    { text: "Milestone 3", done: false }
  ];

  let terminationType = "";
  let reason = "";
</script>

<div class="phase-container">
	<!-- OUTPUT MILESTONES -->
	<div class="section">
		<h3>Output Milestones</h3>
		<div class="checklist-items">
			{#each milestones as m}
				<label class="custom-checkbox">
					<input type="checkbox" bind:checked={m.done} />
					<span class="checkmark"></span>
					{m.text}
				</label>
			{/each}
		</div>
		<button class="pill-button">Add Milestone</button>
	</div>

	<!-- CONTRACT TERMINATION -->
	<div class="section termination-area">
		<h3>Terminate Contract</h3>
		
		<div class="form-group">
			<label for="term-type">Nature of Termination</label>
			<select id="term-type" bind:value={terminationType}>
				<option value="">Termination type</option>
				<option>Immediate</option>
				<option>With Notice</option>
			</select>
		</div>

		<div class="form-group">
			<textarea 
				rows="5" 
				placeholder="Add Reasoning For Termination..." 
				bind:value={reason}
			></textarea>
		</div>

		<div class="footer-actions">
			<button class="pill-button">Confirm</button>
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
		font-size: 1.2rem;
		margin-bottom: 25px;
		font-weight: bold;
		color: #000;
	}

	.section {
		display: flex;
		flex-direction: column;
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

	.custom-checkbox input { display: none; }

	.checkmark {
		height: 22px;
		width: 22px;
		border: 2px solid #333;
		border-radius: 4px;
		margin-right: 15px;
		position: relative;
		flex-shrink: 0;
	}

	.custom-checkbox input:checked + .checkmark { background-color: #333; }
	.custom-checkbox input:checked + .checkmark:after {
		content: "";
		position: absolute;
		left: 7px; top: 3px;
		width: 5px; height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 20px;
	}

	.form-group label {
		font-size: 0.95rem;
		font-weight: 600;
		color: #4b5563;
	}

	select, textarea {
		padding: 12px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		background-color: #f9fafb;
		font-size: 1rem;
		outline: none;
		transition: border-color 0.2s;
	}

	select:focus, textarea:focus {
		border-color: #7a1a1a;
	}

	textarea { resize: vertical; }

	.pill-button {
		align-self: flex-start;
		background-color: #7a1a1a; 
		color: white;
		border: none;
		padding: 10px 28px;
		border-radius: 50px;
		font-weight: bold;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
	}

	.footer-actions {
		margin-top: 10px;
	}

	.pill-button:hover {
		background-color: #5a1313;
	}
</style>