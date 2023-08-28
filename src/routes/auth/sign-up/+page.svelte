<script lang="ts">
	import Alert from '$components/Alert.svelte';
	import Loader from '$components/Loader.svelte';
    import Icon from '@iconify/svelte';
import supabase from '$utils/supabase';
	import { createEventDispatcher } from 'svelte';
	import { toastSignal } from '$lib/store';
	let fullName: string;
	let email: string;
	let password: string;
	let confirmPassword: string;
	let message: string = '';
	let signUped: boolean = true;
	let isLoading: boolean = false;
    let isHovered = false;

	$: isLoading;
	$: signUped;


    const signUpWithGoogle = async (e:Event) => {
        console.log(e.target)

        const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
        })

        console.log(data, error)
    }
    const signUpWithTwitter = async (e:Event) => {
        console.log(e)
    }

	const handleSubmit = async () => {
		isLoading = true;
		message = '';
		if (password !== confirmPassword) {
			isLoading = false;
			//message = 'Passwords do not match';
			toastSignal.update(value => value = "Passwords do not match");
		}

		let userResults = await supabase.auth.signUp({
			email,
			password
		});

		if (userResults.error) {
			message = userResults.error.message;
			console.error(userResults.error.message);
			isLoading = false;
			return;
		}

		//console.log(data);

		if (userResults?.data?.user?.id) {
			const users = await supabase
				.from('userprofile')
				.insert([{ user_id: userResults.data.user.id, full_name: fullName }])
				.select();

			if (users.error) {
				message = users.error.message;
				console.error(users.error.message);
				isLoading = false;
				return;
			}
			signUped = false;
		}

		isLoading = false;
	};

	// const dispatch = createEventDispatcher();

	// function handleClick() {
	// 	dispatch('buttonClick');
	// }
</script>

<div
	class="w-2/3 p-4 md:w-1/3 mx-auto mt-10 dark:bg-secondary-300 bg-blue-200 flex flex-col items-center rounded-lg shadow-xl self-center"
>
	<h1 class="text-2xl font-bold text-center m-2 pt-2 text-gray-900">Unzip your Bag</h1>
	<!-- svelte-ignore missing-declaration -->
    <Alert message={message} />
	{#if signUped}
		<form on:submit|preventDefault={handleSubmit} class="flex flex-col">
			<fieldset disabled={isLoading}>
				<label for="firstName" class="block m-2 text-gray-700 text-sm font-bold mb-2"
					>Full Name
				</label>
				<input
					type="text"
					name="firstName"
					id="firstName"
					bind:value={fullName}
					class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				<label for="email" class="block m-2 text-gray-700 text-sm font-bold mb-2"> Email </label>
				<input
					type="email"
					name="email"
					id="email"
					bind:value={email}
					class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
				/>
				<label for="password" class="block m-2 text-gray-700 text-sm font-bold"> Password </label>
				<input
					type="password"
					name="password"
					id="password"
					bind:value={password}
					class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
				/>
				<label for="password" class="block m-2 text-gray-700 text-sm font-bold"
					>Confirm Password
				</label>
				<input
					type="password"
					name="password"
					id="password"
					bind:value={confirmPassword}
					class="w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
				/>
			</fieldset>
			<button
				type="submit"
				class="variant-filled-primary mx-0 mt-10 rounded-md shadow-lg p-2 hover:mx-4 transition-['margin'] hover:font-bold flex justify-center items-center"
			>
				{#if isLoading}
					<span class="pr-4">Loading</span> <Loader />
				{:else}
					Submit
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
		<p class="m-2 p-2 dark:text-black">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			Already have an account?
			<a href="/auth/login" class="underline">Login</a>
			<!-- <span
			class="underline dark:text-secondary-500 hover:cursor-pointer text-primary-500"
			on:click={handleClick}>Login</span
		> -->
		</p>
	{:else}
		<Alert message="Please check your email for confirmation link..." />
		<div class="btn variant-filled mb-4">
			<a href="/auth/login" class="w-full">Login</a>
		</div>
	{/if}
</div>
<!-- 
<style lang="postcss">
    class:iconi={isHovered} on:mouseover={() => isHovered = true} on:mouseout={() => isHovered = false} 
    .iconi {
        animation: spin-animation 0.5s infinite;
    }

    @keyframes spin-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style> -->