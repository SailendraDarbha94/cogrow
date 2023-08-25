<script lang="ts">
	import { onMount } from "svelte";

    import goku from "$lib/assets/goku.png"
	import createUserFileBucket from "$utils/http";
	import { toastSignal } from "$lib/store";
	import createHelloWorld from "$utils/http";

    onMount(() => {
        const item = localStorage.getItem("token")
        connectWebSocket()
        //console.log(item)
    })

    let files:any;
    async function handleImageChange(event:Event){
        const input = event.target as HTMLInputElement;
        if (input.files) {
            files = input.files;
            console.log(files)
            uploadFile(files)
        }
    }

    let ws: WebSocket;
    function connectWebSocket() {
		//console.log(token)
		ws = new WebSocket('ws://localhost:8000/chat/message');

		ws.onopen = () => {
            toastSignal.update(value => value = "WebSocket connection openend")
		};

		ws.onmessage = (event) => {
			console.log(event);
			console.log(event.data);
		};

		ws.onerror = (error) => {
			console.error('WebSocket Error: ', error);
		};

		ws.onclose = () => {
            toastSignal.update(value => value = "WebSocket connection closed")
		};
	}

	function uploadFile(value:any[]) {
		// && ws.readyState === WebSocket.OPEN
		if (ws) {
			ws.send(files);
		} else {
			console.error('WebSocket is not open. Unable to send the message.');
		}
	}

    function createBucket(){
        createUserFileBucket()
        console.log('Creating bucket')
    }

    function helloWorld() {
        createHelloWorld()
        console.log('Hello world')
    }
</script>

<div class="flex flex-col w-full h-full justify-between">
    <h2 class="h2">Profile Settings</h2>
        <img src={goku} alt="Son Goku" class="h-40 w-40 rounded-lg shadow-lg">
        <input
        type="file"
        id="image"
        on:change={handleImageChange}
        />

        <button on:click={createBucket} class="variant-filled-secondary m-2 p-2 rounded-md">Stubborn User bucket</button>
        <button on:click={helloWorld} class="variant-filled-secondary m-2 p-2 rounded-md">Hello World</button>
</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->