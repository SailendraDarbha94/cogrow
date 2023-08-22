<script lang="ts">
    export let message:string = ''
</script>

{#if message}
    <div class="mb-4 h-12 rounded-md bg-lavenderIndigo p-2 text-center">
        <p>{message}</p>
    </div>
{/if}