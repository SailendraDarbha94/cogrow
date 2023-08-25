<script lang="ts">
	import { page } from "$app/stores";

    // your script goes here

	import Sidebar from "$components/Sidebar.svelte";
	import { fade, fly } from "svelte/transition";
    export let data;

    
</script>

<div class="grid grid-cols-12 gap-2 p-4 ">
    <div class="col-span-3">
        <Sidebar />
    </div>
    {#key $page.data.url}
    <div
        class="col-span-9"
      in:fly={{ y: -200, duration: 300, delay: 200 }}
      out:fade={{ duration: 200 }}
    >
      <slot />
    </div>
  {/key}
</div>

<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->