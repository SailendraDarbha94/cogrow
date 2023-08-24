<script lang="ts">
	import { onMount } from 'svelte';
	import { FileDropzone } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
	import ChatMessage from '$components/ChatMessage.svelte';
	import createSession from '$utils/http';
	onMount(async () => {
		await connectWebSocket();
	});
	interface Message {
		message: string;
		type: string;
	}
	let query: string = '';
	let answer: string = '';
	let loading: boolean = false;
	let chatMessages: Message[] = [];
	let scrollToDiv: HTMLDivElement;
	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	let fileUploaded: boolean = false;
	let files: FileList;
	let connection: WebSocket | null = null;
	let endpoint: string;
	async function uploadFilesArray(params: FileList) {
		connection = new WebSocket(`ws://localhost:8000/ws/${endpoint}`);
		connection.onopen = (event) => {
			console.log('WebSocket Connection Opened: ' + event);
		};
		// Set the event handler for receiving messages
		connection.onmessage = (event) => {
			console.log();
		};

		// Set the event handler for errors
		connection.onerror = (event) => {
			console.error('WebSocket error observed:', event);
			//handleError(event);
		};

		// Set the event handler for closing the connection
		connection.onclose = (event) => {
			if (event) {
				console.log("WebSocket Connection Closed" + event);
				connection = null;
			} else {
				connection = null;
			}
		};
	}
	function onChangeHandler(e: Event): void {
		fileUploaded = !fileUploaded;
		//console.log('file data:', e);
		uploadFilesArray(files);
		console.log('file : ', files);
	}

	async function sessionStart() {
		console.log('Session request');
		createSession();
	}

	let messageText = '';
	let messages: Message[] = [];
	let token = ''; // You can either hard-code this or obtain it dynamically
	let ws: WebSocket;

	$: messages;

	function connectWebSocket() {
		//console.log(token)
		ws = new WebSocket('ws://localhost:8000/chat/message');

		ws.onopen = () => {
			console.log('WebSocket is connected');
		};

		ws.onmessage = (event) => {
			//console.log(event);
			console.log(event.data);
			let a: string = event.data.split('=')[1].toString();
			let b: string = a.split('(')[1].toString();
			let c: string = b.split(')')[0].toString();
			answer = c;
		};

		ws.onerror = (error) => {
			console.error('WebSocket Error: ', error);
		};

		ws.onclose = () => {
			console.log('WebSocket connection closed');
		};
	}

	function sendMessage() {
		// && ws.readyState === WebSocket.OPEN
		if (ws) {
			ws.send(messageText);
			messages.push({
				message: messageText,
				type: 'user'
			});
			messages = messages;
			messageText = '';
		} else {
			console.error('WebSocket is not open. Unable to send the message.');
		}
	}

	let selectedFiles: File[] = [];
	function handleFileInput(event: Event) {
		const input = event.target as HTMLInputElement;

		if (input.files) {
			// Save the selected images
			selectedFiles = Array.from(input.files);
		}
		console.log(selectedFiles);
	}
</script>

<div class="h-full flex justify-center p-2">
	<!-- <button on:click={() => toastStore.trigger(t)}>Show Notif</button> -->
	<div class="w-1/2 py-4">
		<FileDropzone name="files" bind:files on:change={onChangeHandler}>
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
		<div class="flex justify-center">
			<div class="w-full bg-purple-300">
				<p>Drag and drop files here, or click to select files</p>
				<input type="file" id="image" on:change={handleFileInput} style="display: none" multiple />
				<label for="image">Select Images</label>
			</div>
			<button
				class="variant-outline-warning my-4 p-2 rounded-md hover:bg-warning-400 hover:text-black"
				on:click={sessionStart}>Upload file via WebSocket</button
			>
		</div>
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
				<div class="" bind:this={scrollToDiv} />
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
