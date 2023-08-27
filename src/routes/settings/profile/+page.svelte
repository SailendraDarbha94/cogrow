<script lang="ts">
	import { onMount } from 'svelte';

	import goku from '$lib/assets/goku.png';
	import createUserFileBucket from '$utils/http';
	import { toastSignal } from '$lib/store';
	import createHelloWorld from '$utils/http';
	export let data;
	onMount(() => {
		const item = localStorage.getItem('token');
		connectWebSocket();
		//console.log(item)
	});

	let files: any;
	async function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			files = input.files;
			console.log(files);
			uploadFile(files);
		}
	}

	let ws: WebSocket;
	function connectWebSocket() {
		//console.log(token)
		ws = new WebSocket('ws://localhost:8000/chat/message');

		ws.onopen = () => {
			toastSignal.update((value) => (value = 'WebSocket connection openend'));
		};

		ws.onmessage = (event) => {
			console.log(event);
			console.log(event.data);
		};

		ws.onerror = (error) => {
			console.error('WebSocket Error: ', error);
		};

		ws.onclose = () => {
			toastSignal.update((value) => (value = 'WebSocket connection closed'));
		};
	}

	function uploadFile(value: any[]) {
		// && ws.readyState === WebSocket.OPEN
		if (ws) {
			ws.send(files);
		} else {
			console.error('WebSocket is not open. Unable to send the message.');
		}
	}

	function createBucket() {
		createUserFileBucket();
		console.log('Creating bucket');
	}

	function helloWorld() {
		createHelloWorld();
		console.log('Hello world');
	}

	let selectedFile: File;
	async function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			// Save the selected images
			selectedFile = input.files[0];
			let selectedFileLength = await input.files[0].name.split('.');
			let selectedFileLengthNumber: number = (await selectedFileLength.length) - 1;
			let log = selectedFileLength[selectedFileLengthNumber];
			let name: string = 'profile.';
			let profileName: string = name + log;
			console.log(profileName);
		}
		console.log(selectedFile);
	}

	let editingProfile: boolean = false;

	function getTimeDifference() {
		let lastSeen: string = '';
		const date1 = new Date('2023-08-26T13:19:20.303357');
		const date2 = new Date();

		const timeDifference = Math.abs(+date2 - +date1);
		const hoursDifference = Math.floor(Math.min(timeDifference / (1000 * 3600)));
		if (hoursDifference >= 0 && hoursDifference <= 2) {
			lastSeen = 'moments ago';
		} else if (hoursDifference > 2 && hoursDifference < 24) {
			lastSeen = `${hoursDifference} hours ago`;
		} else {
			lastSeen = `${hoursDifference / 24} days ago`;
		}
        console.log(lastSeen);
		return lastSeen;
	}
</script>

<div class="w-full p-2">
	<h2 class="h2 text-center">Profile Settings</h2>

	<div class="w-full flex items-center justify-center">
		<div class="w-1/2">
			<img src={goku} alt="Son Goku" class="mx-auto h-40 w-40 rounded-lg shadow-lg" />
		</div>
		{#if editingProfile}
			<div class="w-1/2">
				<input type="file" class="" on:change={handleFileInput} />
			</div>
		{/if}
	</div>
	<!-- <button on:click={getTimeDifference} class="variant-filled-primary m-2 p-2 rounded-lg"
		>click</button
	> -->
	<div class="flex">
		<div class="w-1/2 flex flex-col items-center justify-center">
			<p class="ml-auto mr-2 my-2">Phone </p>
			<p class="ml-auto mr-2 my-2">Email </p>
			{#if !editingProfile}
				<p class="ml-auto mr-2 my-2">Last Seen</p>
			{/if}
		</div>
		<div class="w-1/2 flex flex-col justify-center items-center">
			{#if editingProfile}
				<input type="text" name="phone" class="input" />
				<input type="email" name="email" value={data.user?.email} class="input" />
			{:else}
				<p class="h5 my-2">{`${data.user?.phone ? data.user?.phone : 'not available'}`}</p>
				<p class="h5 my-2">{data.user?.email}</p>
				<p class="h5 my-2">{getTimeDifference()}</p>
			{/if}
		</div>

	</div>
    {#if editingProfile}
    <button on:click={helloWorld} class="w-full variant-filled-tertiary m-2 p-2 rounded-md"
        >
        Submit
        </button
    >
    {:else}
    <button on:click={() => editingProfile = true} class="w-full variant-filled-secondary m-2 p-2 rounded-md"
        >
        Edit Profile
        </button
    >
    {/if}
	<!-- <button on:click={createBucket} class="variant-filled-secondary m-2 p-2 rounded-md"
		>Stubborn User bucket</button
	>
	<button on:click={helloWorld} class="variant-filled-secondary m-2 p-2 rounded-md"
		>Hello World</button
	> -->
</div>

<!-- markup (zero or more items) goes here -->

<style>
	/* your styles go here */
</style>
