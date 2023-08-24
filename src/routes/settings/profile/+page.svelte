<script lang="ts">
	import { onMount } from "svelte";

    import goku from "$lib/assets/goku.png"

    onMount(() => {
        const item = localStorage.getItem("token")
        connectWebSocket()
        console.log(item)
    })
//     let selectedImages: File[] = [];
//     function handleImageChange(event: Event) {
//     const input = event.target as HTMLInputElement;
//     if (input.files) {
//       // Save the selected images
//       selectedImages = Array.from(input.files);
//     }
//   }
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
			console.log('WebSocket is connected for file upload');
		};

		ws.onmessage = (event) => {
			console.log(event);
			console.log(event.data);
		};

		ws.onerror = (error) => {
			console.error('WebSocket Error: ', error);
		};

		ws.onclose = () => {
			console.log('WebSocket connection closed');
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
</script>

<div class="flex flex-col w-full h-full justify-between">
    <h2 class="h2">Profile Settings</h2>
        <img src={goku} alt="Son Goku" class="h-40 w-40 rounded-lg shadow-lg">
        <input
        type="file"
        id="image"
        on:change={handleImageChange}
        />

</div>
<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->