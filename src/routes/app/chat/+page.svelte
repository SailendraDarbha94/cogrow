<!-- <script lang="ts">
	import { checkAuthAndSetToken } from "$utils/auth";
	import { onMount } from "svelte";

    let messageText = "";
    let messages:string[] = [];
    let token = "";  // You can either hard-code this or obtain it dynamically
    let ws:WebSocket;

    $: messages
    // let session: any;
	// onMount(async () => {
	// 	session = await checkAuthAndSetToken();
	// });

    function connectWebSocket() {
        //console.log(token)
        ws = new WebSocket("ws://localhost:8000/chat/message");
        
        ws.onopen = () => {
            console.log("WebSocket is connected");
        };

        ws.onmessage = (event) => {
            console.log(event.data)
            //console.log(event.data)
            messages.push(JSON.stringify(event.data));
            messages = messages
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error: ", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }

    onMount(async () => {
        await connectWebSocket()
    })
    function sendMessage() {
        // && ws.readyState === WebSocket.OPEN
        if (ws) {
            ws.send(messageText);
            messageText = "";
        } else {
            console.error("WebSocket is not open. Unable to send the message.");
        }
    }
</script>

<div>
    <h1>WebSocket Chat</h1>
    <input bind:value={token} placeholder="Enter Token" class="text-black" />
    <button on:click={connectWebSocket}>Connect</button>
    <div>
        <input bind:value={messageText} placeholder="Enter Message" class="text-black" />
        <button on:click={sendMessage}>Send</button>
    </div>
    <ul>
        {#each messages as message (message)}
            <li>{message}</li>
        {/each}
    </ul>
</div> -->

<script lang="ts">
	import { checkAuthAndSetToken } from '$utils/auth';
	import { onMount } from 'svelte';

	// let session: any;
	// onMount(async () => {
	// 	session = await checkAuthAndSetToken();
	// });

	import { FileDropzone } from '@skeletonlabs/skeleton';
	//import type { ToastSettings } from '@skeletonlabs/skeleton';
	//import type { ChatCompletionRequestMessage } from 'openai';
	//import { notes } from '$lib/stores/basicStore';
	//import { INTROTEXT, folders } from '$lib/stores/constantStore';
	import Icon from '@iconify/svelte';
	import ChatMessage from '$components/ChatMessage.svelte';
	import createSession from '$utils/http';
	//import FolderListView from '$lib/components/FolderListView.svelte';

	let query: string = '';
	let answer: string = '';
	let loading: boolean = false;
	// let chatMessages: ChatCompletionRequestMessage[] = [];
	let chatMessages: any[] = [];
	let scrollToDiv: HTMLDivElement;
	function scrollToBottom() {
		setTimeout(function () {
			scrollToDiv.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
		}, 100);
	}

	let fileUploaded: boolean = false;
	let files: FileList;

	function onChangeHandler(e: Event): void {
		fileUploaded = !fileUploaded;
		//console.log('file data:', e);
		console.log('file : ', files);
	}

	// const handleSubmit = async () => {
	// 	loading = true;
	// 	chatMessages = [...chatMessages, { role: 'user', content: query }];

	// 	const eventSource = new SSE('/api/chat', {
	// 		headers: {
	// 			'Content-Type': 'application/json'
	// 		},
	// 		payload: JSON.stringify({ messages: chatMessages })
	// 	});

	// 	query = '';

	// 	eventSource.addEventListener('error', handleError);

	// 	eventSource.addEventListener('message', (e:any) => {
	// 		scrollToBottom();
	// 		try {
	// 			loading = false;
	// 			if (e.data === '[DONE]') {
	// 				chatMessages = [...chatMessages, { role: 'assistant', content: answer }];
	// 				answer = '';
	// 				return;
	// 			}

	// 			const completionResponse = JSON.parse(e.data);
	// 			const [{ delta }] = completionResponse.choices;

	// 			if (delta.content) {
	// 				answer = (answer ?? '') + delta.content;
	// 			}
	// 		} catch (err) {
	// 			handleError(err);
	// 		}
	// 	});
	// 	eventSource.stream();
	// 	scrollToBottom();
	// };

	function handleError<T>(err: T) {
		loading = false;
		query = '';
		answer = '';
		console.error(err);
	}

	async function chat() {
		chatMessages.push({
            message: query,
            type: "user",
        });
        query = '';
        chatMessages = chatMessages
	}

    async function sessionStart() {
        console.log("Session request")
        createSession()
    }

    let messageText = "";
    let messages:string[] = [];
    let token = "";  // You can either hard-code this or obtain it dynamically
    let ws:WebSocket;

    $: messages
    // let session: any;
	// onMount(async () => {
	// 	session = await checkAuthAndSetToken();
	// });

    function connectWebSocket() {
        //console.log(token)
        ws = new WebSocket("ws://localhost:8000/chat/message");
        
        ws.onopen = () => {
            console.log("WebSocket is connected");
        };

        ws.onmessage = (event) => {
            console.log(event)
            console.log(event.data)
            answer = event.data
            //console.log(event.data)
            messages.push(JSON.stringify(event.data));
            messages = messages
        };

        ws.onerror = (error) => {
            console.error("WebSocket Error: ", error);
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };
    }

    onMount(async () => {
        await connectWebSocket()
    })
    function sendMessage() {
        // && ws.readyState === WebSocket.OPEN
        if (ws) {
            ws.send(messageText);
            messageText = "";
        } else {
            console.error("WebSocket is not open. Unable to send the message.");
        }
    }
</script>

<div class="h-full flex justify-center p-2">
	<!-- <button on:click={() => toastStore.trigger(t)}>Show Notif</button> -->
	<div class="w-1/2 py-4">
        <!-- <h1>WebSocket Chat</h1>
        <input bind:value={token} placeholder="Enter Token" class="text-black" />
        <button on:click={connectWebSocket}>Connect</button>
        <div>
            <input bind:value={messageText} placeholder="Enter Message" class="text-black" />
            <button on:click={sendMessage}>Send</button>
        </div>
        <ul>
            {#each messages as message (message)}
                <li>{message}</li>
            {/each}
        </ul> -->
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
            <button class="variant-outline-warning my-4 p-2 rounded-md hover:bg-warning-400 hover:text-black" on:click={sessionStart}>Create Chat Session</button>
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
					{#if answer}
						<ChatMessage type="user" message={answer} />
					{/if}
					{#if loading}
						<ChatMessage type="chatbot" message="Loading.." />
					{/if}
				</div>
				<div class="" bind:this={scrollToDiv} />
			</div>
			<form class="flex w-full rounded-md gap-4 bg-gray-900 p-4" on:submit|preventDefault={sendMessage}>
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
