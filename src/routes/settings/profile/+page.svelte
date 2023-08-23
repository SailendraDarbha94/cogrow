<script>
	import { onMount } from "svelte";

    onMount(() => {
        const item = localStorage.getItem("token")
        console.log(item)
    })
</script>

<div>
hellooo
</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->o