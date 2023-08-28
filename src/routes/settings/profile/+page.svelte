<script lang="ts">
	import { onMount } from 'svelte';

	import goku from '$lib/assets/goku.png';
	import { toastSignal } from '$lib/store';
	import { env } from '$env/dynamic/public';
	import checkAuthAndSetToken from '$utils/auth.js';
	import upload_file from '$utils/file.js';
	export let data;
	onMount(() => {
		const item = localStorage.getItem('token');
		connectWebSocket();
		checkAuthAndSetToken()
		//console.log(item)
	});

	async function handleImageChange(event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			files = input.files;
			console.log(files);
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


	function createBucket() {
		//createUserFileBucket();
		console.log('Creating bucket');
	}

	function helloWorld() {
		//createHelloWorld();
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

	function getLastSeen(d1:Date = new Date, d2:Date = new Date) {

		let lastSeen: string = '';

		const date1:Date = new Date('2023-08-26T13:19:20.303357');
		const date2:Date = new Date();

		const timeDifference = Math.abs(+date2 - +date1);
		const hoursDifference = Math.floor(Math.min(timeDifference / (1000 * 3600)));
		if (hoursDifference >= 0 && hoursDifference <= 2) {
			lastSeen = 'moments ago';
		} else if (hoursDifference > 2 && hoursDifference < 24) {
			lastSeen = `${hoursDifference} hours ago`;
		} else {
			lastSeen = `${hoursDifference / 24} days ago`;
		}
		lastSeen = hoursDifference > 24 ?  Math.floor(Number(hoursDifference / 24)).toString() + " days ago" : Math.floor(Number(hoursDifference / 24)).toString() + " hours ago"
		return lastSeen;
	}
	
// 	async function uploadFile(e:Event) {
// 		const formData = new FormData
// 		console.log("uploading file", files[0])
// 		formData.append('upload_file', files[0])
// 		fetch(`${env.PUBLIC_BACKEND_URL}/vectors/upload_vector/`, {
//         method: 'POST',
// 		body: formData,
//         headers: {
//             accept: 'application/json',
//             //'Content-Type': 'multipart/form-data',
//             'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6IllNWVlmU1BCb1dXL1Z2UU4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjkzMjExOTEzLCJpYXQiOjE2OTMyMDgzMTMsImlzcyI6Imh0dHBzOi8vc2hnaWl5cnZlaWxzZWdqbnl2dWYuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImUxNjY1YjI2LWQ1ZTctNDAxOS1iMDQ1LTc0ZTg0YjJhZGE5MSIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU2FpbGVuZHJhIERhcmJoYSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTYWlsZW5kcmEgRGFyYmhhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIiwic3ViIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE2OTMyMDgzMTN9XSwic2Vzc2lvbl9pZCI6Ijc4YzBiZGMzLWY2YWQtNGNlOC1iM2I5LTg3NWRmNzM5OGVlYiJ9.OsGbzZ4WTjg3idMv6jkl-cioaOcvjRxrcov3yy-z2dg`
//         }
//     }).then(async data => {
//         let newdata = await data.json()
//         console.log("new data",newdata)
// 		//successToast(newdata.message)
//     }).catch((err:Response) => {
//         toastSignal.update(value => value = "An Error occurred")
//         console.log(err)
//     })
// }

	let files:FileList
	async function uploadFile(e:Event) {
		let file:File = files[0]
		await upload_file(file)

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
				<p class="h5 my-2">{getLastSeen()}</p>
			{/if}
		</div>

	</div>

	<div class="my-2 py-2">
		<h3 class="h3">Upload File</h3>
		<input type="file" bind:files={files}>
		<button on:click={uploadFile} class="w-full variant-filled-tertiary m-2 p-2 rounded-md">Upload File</button>
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
