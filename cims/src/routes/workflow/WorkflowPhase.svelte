<script lang="ts"> 
    let { phase } = $props();
</script>

<div class="phase debug-box">
    <h2 style="text-align:center">Phase: {phase}</h2>
    <p>pretend this is content for the {phase} phase</p>
    <p>of different sizes</p>
    <p>and different types</p>
    <p>pretend this is content</p>
    <p>of different sizes</p>
    <p>and different types</p>
    <p>pretend this is content</p>
    <p>of different sizes</p>
    <p>and different types</p>
</div>

<style>
    .phase {
        
    }
    .debug-box {
        outline: 5px solid orange;
    }
</style>