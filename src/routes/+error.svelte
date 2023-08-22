<script>
    import { page } from "$app/stores";
	import Icon from "@iconify/svelte";
    /**
	 * @type {any}
	 */
     export let status;
    /**
	 * @type {{ message: any; }}
	 */
     export let error;
  </script>
  
  <main class="flex h-screen justify-center items-center flex-wrap">
    <h1 class="w-full text-center"><pre>What you're looking for is probably under construction</pre></h1>
    <div class="w-full text-center">
        <button>
            <a href="/" class="bg-red-300 text-black p-4 m-2 rounded-lg hover:shadow-xl">Go to Home</a>
        </button>
    </div>
    <div class="w-full">
        <Icon icon="fluent-emoji:building-construction" class="w-36 h-24 mx-auto" />
    </div>
  </main>
  