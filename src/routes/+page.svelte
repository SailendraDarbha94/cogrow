<!-- YOU CAN DELETE EVERYTHING IN THIS PAGE -->
<script lang="ts">
	import treebook from '$lib/assets/tree_grow.png';
	import bag from '$lib/assets/futuristic_school_bag.png';
	import girl from '$lib/assets/happy_student_girl.png';
	import { INTROTEXT } from '$lib/store';
	import { AppBar } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400&family=Montserrat:wght@300;400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>
<div class="grid grid-cols-12 gap-2">
	<h2 class="h4 mt-2 pt-2 block md:hidden col-span-12 text-center">
		Unleash the wisdom within your documents with <br /> <span class="underline font-mono font-bold text-3xl">SmartBag</span>
	</h2>
	<div
		class="card !bg-transparent mx-2 my-2 col-start-1 col-end-13 md:col-end-5 flex flex-col items-center"
	>
		<p>{INTROTEXT[0]}</p>
		<img src={treebook} alt="tree growing out of a book" class="w-96 h-80 rounded-lg" />
		<p>{INTROTEXT[2]}</p>
	</div>
	<div
		class="space-y-10 col-span-12 md:col-span-4 md:col-start-5 md:col-end-9 text-center flex flex-col items-center"
	>
		<h2 class="h2 mt-2 pt-2 hidden md:block">
			Unleash the wisdom within your documents with <span class="underline">SmartBag</span>
		</h2>
		<!-- Animated Logo -->
		<figure>
			<section class="img-bg" />
			<img src={bag} alt="school bag" class="w-64 h-80" />
		</figure>
		<!-- / -->
		<div class="flex justify-between items-center space-x-2">
			<a class="btn variant-filled" href="/about" rel="noreferrer"> More About Us </a>
		</div>
		<div class="dark:text-yellow-400">
			<p>
				At its core, SmartBag is designed to simplify your entire <span class="line-through"
					>Digital</span
				> <span class="text-2xl">Life</span>.
				<br />
				<span class="text-sm text-white">Already have a bag ? <a class="underline" href="/auth/login" rel="noreferrer">Login</a> </span>
			</p>
		</div>
	</div>
	<div
		class="card !bg-transparent mx-2 my-2 col-start-1 md:col-start-9 col-end-13 flex flex-col items-center"
	>
		<p class="">{INTROTEXT[1]}</p>
		<img src={girl} alt="girl student" class="w-96 h-80 rounded-lg" />
		<p>{INTROTEXT[3]}</p>
	</div>
</div>

<style lang="postcss">
	@import url('https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,200;0,300;0,400;1,300&family=Merriweather:ital,wght@0,400;0,900;1,400&family=Ubuntu:ital,wght@0,400;1,300;1,400&display=swap');
	figure {
		@apply flex relative flex-col;
	}
	p {
		padding: 2rem;
		//font-family: 'Lato', sans-serif;
		font-family: 'Montserrat', sans-serif;
		font-size: large;
	}
	figure svg,
	.img-bg {
		@apply w-48 h-48;
		margin-top: 4rem;
		margin-left: 2rem;
	}
	.img-bg {
		@apply absolute z-[-1] rounded-full blur-[50px] transition-all;
		animation: pulse 3s cubic-bezier(0, 0, 0, 0.5) infinite, glow 3s linear infinite;
	}
	@keyframes glow {
		0% {
			@apply bg-purple-300/80;
		}
		33% {
			@apply bg-purple-500/80;
		}
		66% {
			@apply bg-purple-500/80;
		}
		100% {
			@apply bg-purple-700/80;
		}
	}
	@keyframes pulse {
		50% {
			transform: scale(1.5);
		}
	}
</style>
