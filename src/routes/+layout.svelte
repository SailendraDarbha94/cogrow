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
	// import { checkAuthAndSetToken } from '$utils/auth';
	import { toastSignal } from '$lib/store';
	import AuthenticatedHeader from '$components/AuthenticatedHeader.svelte';
	import { page } from '$app/stores';
	import { fade, fly } from 'svelte/transition';
	import Sidebar from '$components/Sidebar.svelte';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
	let session: any;
	export let data;
	// afterUpdate(async () => {
	// 	session = await checkAuthAndSetToken();
	// });
	const toastStore = getToastStore();

	onMount(() => {
		toastSignal.update(value => value = "Welcome To Smartbag")
	})
	console.log(data);
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
		{#if data.user}
			<AuthenticatedHeader />
		{:else}
			<Header />
		{/if}
	</svelte:fragment>
	<div class="flex">
		{#if data.user}
			<div class="hidden md:block md:w-1/3">
				<Sidebar />
			</div>
		{/if}
		{#key $page.url.pathname}
			<div
				in:fly={{ delay: 100, duration: 250, y: -100 }}
				out:fade={{ duration: 100 }}
				class="w-full"
			>
				<slot />
			</div>
		{/key}
	</div>
	<svelte:fragment slot="footer">
		<Toast />
	</svelte:fragment>
</AppShell>
