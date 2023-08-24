<script lang="ts">
	import { page } from "$app/stores";
	import FilePanel from "$components/FilePanel.svelte";
	import Icon from "@iconify/svelte";
	import { Tab, TabAnchor, TabGroup } from "@skeletonlabs/skeleton";

    // your script goes here
    let tabSet: number = 0;
	let paneDetails = {
		title: 'Files & Folders',
		name: 'file',
		arr: ['1', '2', '3', '4', '5', '6']
	};
    interface TabNav {
        id: number;
        name: string;
        icon: string;
    }

    let tabs:TabNav[] = [
        {
            id: 1,
            name: "Files",
            icon: "solar:file-bold-duotone"
        },
        {
            id: 2,
            name: "Audio",
            icon: "ant-design:audio-filled"
        },
        {
            id: 3,
            name: "Video",
            icon: "typcn:video-outline"
        }
    ]

</script>



<TabGroup 
	justify="justify-center"
	active="variant-outline-primary"
	hover="hover:variant-soft-primary"
	flex="flex-1 lg:flex-none"
	rounded=""
	border=""
	class="w-full"
>


    {#each tabs as tab (tab.id)}
	<Tab bind:group={tabSet} name={"tab" + tab.id.toString()} value={tab.id} class="rounded-md w-20 mx-2">
		<svelte:fragment slot="lead">
            <Icon icon={tab.icon} class="h-5 w-5 mx-auto" />
        </svelte:fragment>
        <h4 class="h4">
            {tab.name}
        </h4>
	</Tab>
    {/each}
	<!-- <Tab bind:group={tabSet} name="tab2" value={1}>(label 2)</Tab> -->
	<!-- Tab Panels --->
	<svelte:fragment slot="panel">
		{#if tabSet === 1}
            <FilePanel data={paneDetails} />
		{:else if tabSet === 2}
			(tab panel 2 contents)
		{:else if tabSet === 3}
			(tab panel 3 contents)
		{/if}
	</svelte:fragment>
</TabGroup>
			
	<!-- ... -->


<style>
    /* your styles go here */
</style>

<!-- markup (zero or more items) goes here -->