<script lang="ts">
	import { onMount } from 'svelte';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import ChatMessage from '$components/ChatMessage.svelte';
	import createSession from '$utils/http';
	import { browser } from '$app/environment';
	import { env } from '$env/dynamic/public';
	import { toastSignal } from '$lib/store';
	// onMount(async () => {
	// 	await connectWebSocket();
	// });
	let scrollToDiv: HTMLDivElement;
	interface Message {
		message: string;
		type: string;
	}

	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	let files:FileList;
	let query: string = '';
	let answer: string = '';
	let loading: boolean = false;
	let chatMessages: Message[] = [];
	let fileUploaded: boolean = false;
	let messages:Message[] = [];
	let messageText:string = '';

	async function sendMessage(e:Event) {
		console.log(messageText, e.target)
	}

	async function goingMad(formData:FormData) {
		fetch(`http://15.206.195.182/vectors/upload_vector`, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${env.PUBLIC_AUTH_TOKEN}`
        },
		body: formData
    }).then(data => console.log(data)).catch((err:any) => {
        toastSignal.update(value => value = "An Error occurred")
        console.error(err)
    })
	}

	let selectedFile: File
	async function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;
		const formData = new FormData()
		if (input.files) {
			// Save the selected images
			console.log(input.files)
			selectedFile = input.files[0]
			console.log("Selected File :" ,selectedFile)
			formData.append('upload_file', selectedFile)
			console.log(formData.toString())
			await goingMad(formData)
		}
	}
</script>

<div class="h-full flex justify-center p-2">
	<!-- <button on:click={() => toastStore.trigger(t)}>Show Notif</button> -->
	<div class="w-1/2 py-4">
		<FileDropzone name="files" bind:files on:change={handleFileInput}>
			<svelte:fragment slot="lead">
				<Icon icon="bx:file" width="60px" class="mx-auto" />
			</svelte:fragment>
			<svelte:fragment slot="message">
				<span> Upload any file or drag 'n drop </span>
			</svelte:fragment>
			<svelte:fragment slot="meta">
				<span> md, png, pdf files allowed </span>
			</svelte:fragment>
		</FileDropzone>
		<!-- <form action="http://15.206.195.182/vectors/upload_vector/" on:submit|preventDefault={handleFileInput} method="POST" enctype="multipart/form-data">
			<input type="file" name="file" />
			<input type="submit" class="btn variant-form-material"/>
		 </form> -->
	</div>
	<div class="w-1/2 flex flex-col pt-4 px-8 items-center gap-2">
		{#if fileUploaded}
			<div>
				<h1 class="text-2xl font-bold w-full text-center">Talk to the Bag</h1>
				<p class="text-sm italic">Powered by a "really smart bag of SHIT"</p>
			</div>
			<div class="h-[500px] w-full bg-gray-900 rounded-md p-4 overflow-y-auto flex flex-col gap-4">
				<div class="flex flex-col gap-2 text-white">
					<ChatMessage type="chatbot" message="Hello, ask me what you want!" />
					{#each chatMessages as message}
						<ChatMessage type={message.type} message={message.message} />
					{/each}
					{#each messages as message}
						<ChatMessage type={message.type} message={message.message} />
					{/each}
					{#if answer}
						<ChatMessage type="chatbot" message={answer} />
					{/if}
					{#if loading}
						<ChatMessage type="chatbot" message="Loading.." />
					{/if}
				</div>
				<!-- <div class="" bind:this={scrollToDiv} /> -->
			</div>
			<form
				class="flex w-full rounded-md gap-4 bg-gray-900 p-4"
				on:submit|preventDefault={sendMessage}
			>
				<input type="text" class="input input-bordered w-full" bind:value={messageText} />
				<button type="submit" class="btn btn-accent text-white"> Send </button>
			</form>
		{:else}
			<Icon icon="icon-park:ghost" width="60px" class="mx-auto" />
			<pre>Upload a file so we can talk!</pre>
		{/if}
	</div>
</div>

<style>
	/* your styles go here */
</style>
