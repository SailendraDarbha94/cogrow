import { writable } from "svelte/store";


// place files you want to import through the `$lib` alias in this folder.
const user = writable<any>();

export const toastSignal = writable<string>()

export default user