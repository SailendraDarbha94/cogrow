<script lang="ts">
	import { page } from "$app/stores";
	import Icon from "@iconify/svelte";

    // your script goes here

    interface NavLink {
        id: number;
        path: string;
        name: string;
        icon: string;
    }
    $: currentRoute = $page.url.pathname;

    let links:NavLink[] = [
        {
            id: 1,
            path: "/app/chat",
            name: "SmartBag",
            icon: "game-icons:school-bag"
        },
        {
            id: 2,
            path: "/app/storage",
            name: "Storage",
            icon: "map:storage"
        },
        {
            id: 3,
            path: "/app/prep",
            name: "Prep",
            icon: "pajamas:question"
        },
        {
            id: 4,
            path: "/settings/profile",
            name: "Profile",
            icon: "iconamoon:profile"
        }
    ]
</script>

<div class="h-full w-full p-2 sidebar">
    <ul class="flex flex-col">
        
            {#each links as link (link.id)}
            <li class:active={currentRoute === link.path} class="w-10/12 hover:w-11/12 transition-[width] bg-secondary-300 my-2  mx-auto  rounded-md">
                <a href={link.path} class="mr-2 flex justify-center items-center text-black my-1 py-1 rounded-lg hover:">{link.name} <Icon icon={link.icon} class="ml-2 2h-5 w-5" /></a>
                
            </li>
            {/each}
            <!-- <a href="/app/storage" class="w-full bg-teal-800 flex justify-center py-2 rounded-lg my-1">Storage</a>
            <a href="/app/prep" class="w-full bg-teal-800 flex justify-center py-2 rounded-lg my-1">Prep</a> -->
            <!-- <a href="/app" class="w-full bg-teal-800 flex justify-center py-2 rounded-lg my-1">Home</a> -->
    </ul>
</div>

<style lang="postcss">
    /* your styles go here */
    .sidebar {
        /* box-shadow: 0 0 3px 6px rgba(255, 205, 210, 0.7); */
        /* border-radius: 4px; */
    }

    .active {
        @apply w-11/12 text-lg
    }
</style>

<!-- markup (zero or more items) goes here -->