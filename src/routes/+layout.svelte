<script lang="ts">
	import '../app.postcss';

	// Highlight JS
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { AppShell, initializeStores, storeHighlightJs } from '@skeletonlabs/skeleton';
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Header from '$components/Header.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import supabase from '$utils/supabase';
	import { redirect } from '@sveltejs/kit';
	import { checkAuthAndSetToken } from '$utils/auth';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores()
	let session: any;
	
	afterUpdate(async () => {
		session = await checkAuthAndSetToken();
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<svelte:fragment slot="default">
		<slot />
	</svelte:fragment>
</AppShell>
