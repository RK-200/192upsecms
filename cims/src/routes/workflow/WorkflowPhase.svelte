<script lang="ts"> 
    let { phase } = $props();
</script>

<div class="phase debug-box">
    <h2 style="text-align:center">Phase: {phase}</h2>
</div>

<style>
    .phase {
        
    }
    .debug-box {
        outline: 5px solid orange;
    }
</style>