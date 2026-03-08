<script lang="ts">
export let postworkId: string;
	let milestones = [
		{ text: "Milestone 1", done: false },
		{ text: "Milestone 2", done: false },
		{ text: "Milestone 3", done: false }
	];

	let terminationType = "";
	let reason = "";
	
	import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  function handleback() {
	dispatch("back");
  }
	function addMilestone() {
    milestones = [...milestones, { text: `Milestone ${milestones.length + 1}`, done: false }];
}

function removeMilestone(index: number) {
    milestones = milestones.filter((_, i) => i !== index);
}
</script>

<div class="phase-container">
	<!-- OUTPUT MILESTONES -->
	<div class="section-card">
    <h3>Output Milestones</h3>

    <div class="checklist-items">
        {#each milestones as m, i}
            <div class="milestone-row">
                <label class="custom-checkbox">
                    <input type="checkbox" bind:checked={m.done} />
                    <span class="checkmark"></span>
                </label>

                <input
                    type="text"
                    class="editable-text"
                    bind:value={m.text}
                    placeholder="Enter milestone"
                />

                <button class="delete-btn" onclick={() => removeMilestone(i)}>×</button>
            </div>
        {/each}
    </div>

    <button class="pill-button" onclick={addMilestone}>+ Add Milestone</button>
</div>

	<!-- CONTRACT TERMINATION -->
	<div class="section-card termination-area">
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
	<div class="pagenav">
		<button class="back" onclick={handleback}>Return to <br/> Signing and Activation</button>
	</div>
</div>

<style>
	/* ===== LAYOUT (NOT FULL FRAME) ===== */
	.phase-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 60px;
		font-family: sans-serif;
	}

	/* ===== CARD STYLE ===== */
	.section-card {
		display: flex;
		flex-direction: column;
		padding: 28px;
		border: 1px solid #e5e7eb;
		border-radius: 16px;
		background: white;
	}

	h3 {
		font-size: 1rem;
		margin-bottom: 22px;
		font-weight: bold;
		color: #000;
	}

	/* ===== CHECKLIST ===== */
	.checklist-items {
		display: flex;
		flex-direction: column;
		gap: 16px;
		margin-bottom: 24px;
	}

	.custom-checkbox {
		display: flex;
		align-items: center;
		cursor: pointer;
		font-size: 0.95rem;
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
		margin-right: 14px;
		position: relative;
		flex-shrink: 0;
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

	.milestone-row {
    display: flex;
    align-items: center;
    gap: 12px;
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

	/* ===== FORM ===== */
	.form-group {
		display: flex;
		flex-direction: column;
		gap: 8px;
		margin-bottom: 18px;
	}

	.form-group label {
		font-size: 0.9rem;
		font-weight: 600;
		color: #4b5563;
	}

	select,
	textarea {
		padding: 12px;
		border: 1px solid #d1d5db;
		border-radius: 8px;
		background-color: #f9fafb;
		font-size: 0.95rem;
		outline: none;
	}

	select:focus,
	textarea:focus {
		border-color: #7a1a1a;
	}

	textarea {
		resize: vertical;
	}

	/* ===== BUTTONS ===== */
	.pill-button {
		align-self: flex-start;
		background-color: #7a1a1a;
		color: white;
		border: none;
		padding: 10px 26px;
		border-radius: 50px;
		font-weight: bold;
		cursor: pointer;
	}

	.footer-actions {
		margin-top: 8px;
	}

	.pill-button:hover {
		background-color: #5a1313;
	}

	.back {
  background-color: #7a1a1a; /* maroon */
  color: white;
  flex: 0.14;
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
  justify-content: left;
  margin-top: 30px;
}

.back:hover {
  background-color: #5a1313;
}

.back:active {
  transform: scale(0.97);
}
</style>
