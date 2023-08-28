<script lang="ts">
	import Loader from "$components/Loader.svelte";
import { env } from "$env/dynamic/public";
	import { toastSignal } from "$lib/store";

    	let message:string
	let newdata:string
    let loading:boolean = false
	async function chatBot(e:Event) {
        loading = true
    const token:string = localStorage.getItem('token') as string
	//const token:string = "eyJhbGciOiJIUzI1NiIsImtpZCI6IllNWVlmU1BCb1dXL1Z2UU4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjkzMjM5ODEzLCJpYXQiOjE2OTMyMzYyMTMsImlzcyI6Imh0dHBzOi8vc2hnaWl5cnZlaWxzZWdqbnl2dWYuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImUxNjY1YjI2LWQ1ZTctNDAxOS1iMDQ1LTc0ZTg0YjJhZGE5MSIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU2FpbGVuZHJhIERhcmJoYSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTYWlsZW5kcmEgRGFyYmhhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIiwic3ViIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE2OTMyMTk3NDV9XSwic2Vzc2lvbl9pZCI6ImY0YzBmYzliLTA3ODUtNDIxZi1hNTkwLTcwNjAxZmVmYTZjNiJ9.DKbQWJP5PBqzZf0fa8aabyIZhGllPYA7HX1g5fc6bTY"
	console.log('sending query');

	fetch(`${env.PUBLIC_BACKEND_URL}/chat/http/message?message=${message}`, {
		method: 'GET',
		headers: {
			accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	})
		.then(async (data) => {
			//const DATA = await data.json()
			//console.log('DATA  :  ', DATA);
			console.log("data:",data)
			let a = await data.json()
            newdata = a.result
            loading = false
            //toastSignal.update((value:string) => value = "")
		})
		.catch((err: Response) => {
            loading = false
			toastSignal.update((value:string) => value = 'An Error occurred')
			console.log(err);
		});
	}
</script>


<svelte:head>
	<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
</svelte:head>
<div class="flex">
    <div class="w-1/2 mx-auto flex flex-col items-center justify-center">
        <h3 class="h2 text-center my-2">Talk to your bag</h3>
        {#if loading}
            <Loader />
        {:else}
        <input type="text" class="text-black input my-2" placeholder="type your question" name="chat" bind:value={message} />
        <button class="btn variant-filled-primary my-2" on:click={chatBot}>send message</button>
        {/if}
        
        {#if newdata}
            <div class="w-1/2 mx-auto">
                <h2 class="h3">Smartbag Says:</h2>
                <p>{newdata}</p>
            </div>
        {:else}
            <h2 class="h3 text-center">Ask the bag </h2>
        {/if}
    </div>
</div>