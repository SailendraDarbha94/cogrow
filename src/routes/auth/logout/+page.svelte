<script lang="ts">
	import { goto } from "$app/navigation";
	import Loader from "$components/Loader.svelte";
	import { errorToast } from "$utils/helpers";
	import supabase from "$utils/supabase";
	import { onMount } from "svelte";


	onMount(async () => {
		const { error } = await supabase.auth.signOut()
		if (error) {
			console.error(error);
			errorToast(error.message);
		}
        goto('/auth/login')
	});
</script>

<div class="flex h-screen justify-center items-center">
	<Loader />
</div>
