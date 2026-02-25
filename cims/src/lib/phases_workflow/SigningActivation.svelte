<script lang="ts">
import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();

    let checklist = [
        { text: "Party 1", done: false },
        { text: "Party 2", done: false },
        { text: "Party 3", done: false }

    ];
    let notes = "";
	$: {
        const checkedCount = checklist.filter(item => item.done).length;
        dispatch("progress", { phase: "Signing and Activation", checkedCount });
    }
</script>

<div class="phase-container">
	<!-- CHECKLIST -->
	<div class="checklist-section">
		<h3>Checklist</h3>
		<div class="checklist-items">
			{#each checklist as item}
				<label class="custom-checkbox">
					<input type="checkbox" bind:checked={item.done} />
					<span class="checkmark"></span>
					{item.text}
				</label>
			{/each}
		</div>
		<button class="pill-button">Signature</button>
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

	.checklist-items {
		display: flex;
		flex-direction: column;
		gap: 15px;
		margin-bottom: 30px;
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
		height: 22px;
		width: 22px;
		border: 2px solid #333;
		border-radius: 4px;
		margin-right: 15px;
		display: inline-block;
		position: relative;
		flex-shrink: 0;
	}

	.custom-checkbox input:checked + .checkmark {
		background-color: #333;
	}

	.custom-checkbox input:checked + .checkmark:after {
		content: "";
		position: absolute;
		left: 7px;
		top: 3px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.pill-button {
		background-color: #7a1a1a;
		color: white;
		border: none;
		padding: 10px 30px;
		border-radius: 50px;
		font-weight: bold;
		cursor: pointer;
		box-shadow: 0 4px 6px rgba(0,0,0,0.1);
		transition: background-color 0.2s;
	}

	.pill-button:hover {
		background-color: #5a1313;
	}
</style>