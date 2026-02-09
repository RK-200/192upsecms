<script>
    import WorkflowMainPanel from "./WorkflowMainPanel.svelte";

</script>


<h1>Workflow Creation Page</h1>

<div class="main-content">
    <div class="debug-box">
        <h3>Created Workflows:</h3>
        <p>None</p>
    </div>

    <WorkflowMainPanel/>
</div>


<style>
    .main-content {
        display: grid;
        grid-template-columns: 1fr 8fr;
        gap: 2em;
        
        outline: 5px solid pink;
    }

    .debug-box {
        outline: 5px solid red;
    }
</style>