<script lang="ts">
	import '../app.postcss';
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';

	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	import { AppShell, initializeStores, storeHighlightJs } from '@skeletonlabs/skeleton';
	storeHighlightJs.set(hljs);

	// Floating UI for Popups
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	import { storePopup } from '@skeletonlabs/skeleton';
	import Header from '$components/Header.svelte';
	import { afterUpdate, onMount } from 'svelte';
	import { checkAuthAndSetToken } from '$utils/auth';
	import { toastSignal } from '$lib/store';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
	let session: any;

	afterUpdate(async () => {
		session = await checkAuthAndSetToken();
	});
	const toastStore = getToastStore();

	toastSignal.subscribe((value) => {
		if (value) {
			toastStore.trigger({
				message: value
			});
		}
		console.log(value);
	});
</script>

<AppShell>
	<svelte:fragment slot="header">
		<Header />
	</svelte:fragment>
	<svelte:fragment slot="default">
		<slot />
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<Toast />
	</svelte:fragment>
</AppShell>
