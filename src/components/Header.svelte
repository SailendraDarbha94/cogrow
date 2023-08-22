<script>
  import { page } from '$app/stores';
  import Icons from '$components/Icons.svelte';
  import Logo from '$lib/assets/logo.png'
  //import { cartQuantity } from '../store';
  import SearchBar from '$components/SearchBar.svelte';
  import { createEventDispatcher } from 'svelte';
	import { LightSwitch } from '@skeletonlabs/skeleton';

  const dispatch = createEventDispatcher();

  $: currentRoute = $page.url.pathname;

  let showMenu = false;

  let   tabs = [
    { name: 'Home', path: '/home' },
    { name: 'Settings', path: '/settings' },
    //{ name: 'Apparel', path: '/search/clothes' }
  ];
  function openCart() {
    showMenu = false;
    dispatch('openCart', true);
  }
</script>

<nav class="flex items-center border-b border-zinc-700 p-4 lg:px-6">
  <div class="flex w-1/3 items-center">
    <div class="mr-4" class:active={currentRoute === '/'}>
      <a href="/" data-sveltekit-prefetch class="">
        <picture>
          <source srcset={Logo} type="image/png" />
          <img
            alt="Svelte Logo"
            class="h-[38] w-[32]"
            decoding="async"
            height={38}
            loading="eager"
            src={Logo}
            width={32}
          />
        </picture>
      </a>
    </div>
    <div class="hidden lg:flex">
      {#each tabs as tab, i (tab.name)}
        <div class:active={currentRoute === tab.path}>
          <a
            data-sveltekit-prefetch
            href={tab.path}
            class={`hover:opacity-100 px-2 py-1 text-white rounded-lg ${
              currentRoute === tab.path ? 'opacity-100' : 'opacity-75'
            }`}>{tab.name}</a
          >
        </div>
      {/each}
    </div>
  </div>
  <div class="hidden w-1/3 lg:block">
    <SearchBar />
  </div>
    <div class="ml-auto flex items-center">
      <LightSwitch class="mr-4" />
    <!--
      THIS IS THE CART ICON TODO: EDIT THIS TO PROFILE
       <button on:click={openCart} class="relative my-2 mx-4">
      <Icons strokeColor="#fff" type="cart" />
      <div
        data-test="cart-quantity"
        class="absolute bottom-0 left-0 -ml-3 -mb-3 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-white text-xs text-black"
      >
        2
      </div>
    </button> -->
    <button
      on:click={() => {
        showMenu = true;
      }}
      aria-label="Open menu"
      class="lg:hidden"
    >
      <Icons type="menu" />
    </button>
  </div>
  {#if showMenu}
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      on:click|self={() => {
        showMenu = false;
      }}
      class="absolute inset-0 z-50 flex max-h-screen w-full justify-end overflow-hidden bg-black/50 lg:hidden"
    >
      <div class="z-30 w-full bg-black p-6 md:w-1/2 lg:w-1/3">
        <div class="flex w-full items-center justify-between">
          <button
            aria-label="Close menu"
            on:click={() => {
              showMenu = false;
            }}
          >
            <Icons strokeColor="#fff" type="close" />
          </button>
          <!-- <button on:click={openCart} class="relative mr-4">
            <Icons strokeColor="#fff" type="cart" />
            <div
              class="absolute bottom-0 left-0 -ml-3 -mb-3 flex h-5 w-5 items-center justify-center rounded-full border border-black bg-white text-xs text-black"
            >
              2
            </div>
          </button> -->
        </div>
        <div class="mt-6 flex w-full flex-col">
          {#each tabs as tab, i (tab.name)}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <div
              class:active={currentRoute === tab.path}
              on:click={() => {
                showMenu = false;
              }}
            >
              <a
                data-sveltekit-prefetch
                href={tab.path}
                class={`hover:opacity-100 px-2 py-1 text-white font-bold text-xl rounded-lg ${
                  currentRoute === tab.path ? 'opacity-100' : 'opacity-75'
                }`}>{tab.name}</a
              >
            </div>
          {/each}
        </div>
      </div>
    </div>
  {/if}
</nav>

<style lang="postcss">
  /* .active {
    opacity: 1;
    background-color: aliceblue;
    class:active={isHovered} on:mouseover={() => isHovered = true} on:mouseout={() => isHovered = false} 
  } */
  
    .active {
      opacity: 1;
      border: 1px solid whitesmoke;
      border-radius: 2px;
        /* animation: spin-animation 0.9s infinite; */
    }

    @keyframes spin-animation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(359deg);
  }
}
</style>