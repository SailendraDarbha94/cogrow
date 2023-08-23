<script lang="ts">

	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import { onMount } from "svelte";
	import supabase from "$utils/supabase";


	let pageData:any;

	if (browser){
		pageData = localStorage.getItem("userData")
	}

</script>
<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->

<div class="container h-full mx-auto flex justify-center items-center">
	<div class="space-y-5">
		<h1 class="h1">Let's get cracking bones!</h1>
		<p>Start by exploring:</p>
		<ul>
			<li><code class="code">/src/routes/+layout.svelte</code> - barebones layout</li>
			<li><code class="code">/src/app.postcss</code> - app wide css</li>
			<li>
				<code class="code">/src/routes/+page.svelte</code> - this page, you can replace the contents
			</li>
		</ul>
		<a href="/auth/sign-up">signup</a>
		<a href="/auth/login">login</a>
		<a href="/profile">prof</a>
	</div>
</div>
