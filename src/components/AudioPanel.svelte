<script lang="ts">
	import Icon from '@iconify/svelte';
	interface Props {
		title: string;
		arr: string[];
		name: string;
	}

	export let data: Props;
</script>

<div class="floaty dark:bg-transparent">
	<div class="col-span-12 text-center border-b-2 border-black pb-2 flex justify-center items-center">
		<h1 class="sm:text-2xl md:text-3xl font-bold dark:text-white w-10/12 md:w-11/12">
			{data.title}
		</h1>
		<div class="w-2/12 md:w-1/12 flex justify-center items-center">
			<Icon icon="icon-park-solid:add-one" class="w-10 h-10 hover:cursor-pointer" />
		</div>
	</div>
	{#each data.arr as ar}
		<div class="floaty-item flex flex-col dark:hover:bg-black">
			<Icon icon="game-icons:sound-waves" color="black" class="w-12 h-12 self-center" />
			<div>
				<h2 class="text-lg font-bold dark:text-white mb-2">
					{data.name}
					{ar}
				</h2>
			</div>
		</div>
	{/each}
</div>

<!-- <AppShell>...</AppShell> -->

<style>
	.floaty {
		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-gap: 8px;
		padding: 16px;
		margin: 18px;
		border-radius: 8px;
		box-shadow: 0 0 4px 6px rgba(0, 0, 0, 0.2);
	}
	.floaty-item {
		/* background: dodgerblue; */
		padding: 8px;
		margin: 8px;
		width: 100px;
		height: 100px;
		border: 1px solid #ccc;
		border-radius: 8px;
		align-self: center;
		text-align: center;
		justify-self: center;
		grid-column: span 4;
		color: black;
		box-shadow: 0 0 2px 3px rgba(12, 34, 222, 0.2);
	}
	.floaty-item:hover {
		box-shadow: none;
		cursor: pointer;
	}
	@media screen and (max-width: 768px) {
		.floaty {
			margin: 2px;
			padding: 2px;
			height: 300px;
			overflow-y: scroll;
		}
		.floaty-item {
			grid-column: span 6;
		}
	}
</style>
