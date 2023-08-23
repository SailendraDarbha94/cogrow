<script lang="ts">
	import { checkAuthAndSetToken } from "$utils/auth";
	import { onMount } from "svelte";

    let session:any;
    onMount(async () => {
        session = await checkAuthAndSetToken()
    })
</script>

<div class="flex h-screen justify-center items-center bg-purple-400 text-blue-600 border-lime-400 h2">
    if youre seeing this then header should reflect that feeling
</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->