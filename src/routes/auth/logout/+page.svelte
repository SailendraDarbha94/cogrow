<script lang="ts">
	import { goto } from "$app/navigation";
	import { errorToast } from "$utils/helpers";
	import supabase from "$utils/supabase";
	import { onMount } from "svelte";


	onMount(async () => {
		let { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
			errorToast(error.message);
		}

        goto('/auth/login')
	});
</script>
