<script lang="ts">
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
    <!-- <input bind:value={token} placeholder="Enter Token" class="text-black" />
    <button on:click={connectWebSocket}>Connect</button> -->
    <div>
        <input bind:value={messageText} placeholder="Enter Message" class="text-black" />
        <button on:click={sendMessage}>Send</button>
    </div>
    <ul>
        {#each messages as message (message)}
            <li>{message}</li>
        {/each}
    </ul>
</div>