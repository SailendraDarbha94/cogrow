<script lang="ts">
	import { goto } from '$app/navigation';
	import Alert from '$components/Alert.svelte';
	import Loader from '$components/Loader.svelte';
	import { checkAuthAndSetToken } from '$utils/auth';
	import supabase from '$utils/supabase';
	import Icon from '@iconify/svelte';
	import { createEventDispatcher, onMount } from 'svelte';

	import { toastSignal } from '$lib/store';

	const dispatch = createEventDispatcher();

	let email: string;
	let password: string;
	let message: string = '';
	let isLoading: boolean = false;
    let session:any;
    onMount(async () => {
        session = await checkAuthAndSetToken()
    })
    const signUpWithGoogle = async (e:Event) => {
        console.log(e.target)

        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
		options: {
			redirectTo: "http://localhost:5173/app"
		}
        })

        console.log(data, error)
    }
    const signUpWithTwitter = async (e:Event) => {
        console.log(e)
    }

	async function handleSubmit() {
		isLoading = true;
		message = '';
		let { data, error } = await supabase.auth.signInWithPassword({
			email,
			password
		});

		if (error) {
			//message = error.message;
			email = '';
			password = '';
			isLoading = false;
			toastSignal.update(value => value = error?.message as string);
			console.error(error.message);
			return;
		} else {
            goto('/notes')
        }

        if (data) {
            isLoading = false;
            console.log(data);
        }
	}
</script>

<div
	class="w-2/3 p-4 md:w-1/3 mx-auto mt-10 dark:bg-secondary-300 bg-purple-300 flex flex-col items-center rounded-lg shadow-xl self-center"
>
	<h1 class="text-2xl font-bold text-center m-2 pt-2 text-gray-900">Opening the bag? Smart!</h1>
	<form on:submit|preventDefault={handleSubmit} class="flex flex-col">
        <Alert {message} />
		<fieldset disabled={isLoading}>
			<label for="email" class="block m-2 text-gray-700 text-sm font-bold mb-2">Email</label>
			<input
				type="email"
				name="email"
				id="email"
				bind:value={email}
				class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				placeholder="example@mail.com"
			/>
			<label for="password" class="block m-2 text-gray-700 text-sm font-bold">Password</label>
			<input
				type="password"
				name="password"
				id="password"
				bind:value={password}
				class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
				placeholder="********"
			/>
		</fieldset>
		<!-- <button
			type="submit"
			class="variant-filled-primary mx-0 mt-10 rounded-md shadow-lg p-2 hover:mx-4 transition-['margin'] hover:font-bold"
		>
			Login
		</button> -->
        <button
        type="submit"
        class="variant-filled-primary mx-0 mt-10 rounded-md shadow-lg p-2 hover:mx-4 transition-['margin'] hover:font-bold flex justify-center items-center"
    >
        {#if isLoading}
            <span class="pr-4">Loading</span> <Loader />
        {:else}
            Login
        {/if}
    </button>
	</form>
    <div class="p-2 flex justify-around flex-wrap">
        <p class="w-full text-center text-black">Or Login with</p>
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class="w-1/2 p-1 hover:cursor-pointer" on:click={signUpWithGoogle}>
            <Icon icon="flat-color-icons:google" class="h-10 w-10 ml-auto mr-1 rounded-md" />
        </div>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <div class="w-1/2 p-1 hover:cursor-pointer" on:click={signUpWithTwitter}>
            <Icon icon="icon-park:big-x" class="h-10 w-10 ml-1 rounded-md mr-auto" />
        </div>
    </div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<p class="m-2 p-2 dark:text-black">
		Don't have an account?
		<a href="/auth/sign-up" class="underline">Sign-Up</a>
		<!-- <span
			class="underline hover:cursor-pointer dark:text-secondary-500 text-primary-500"
			on:click={handleClick}>Sign-Up</span
		> -->
	</p>
</div>
