import { writable } from "svelte/store";


export const INTROTEXT: string[] = [
	'SmartBag is the revolutionary AI-powered service that empowers you to effortlessly upload and parse your files while retaining their knowledge and context. Gone are the days of sifting through countless documents, struggling to remember where you stored important information or losing track of valuable insights.',
	'With the help of SmartBag, you can unlock a new level of productivity by having all your notebooks and their knowledge at your fingertips, combining multiple contexts, storing your notes, and consolidating your knowledge like never before',
	'SmartBag revolutionizes the way you interact with your files, folders, notes and much more, making them not just static pieces of information but dynamic resources that actively contribute to your growth and efficiency.',
	'With SmartBag, you no longer have to worry about scattered files, lost information, or missed opportunities. Embrace a smarter way of managing your documents and experience the power of AI-driven knowledge retention. Revolutionize your life today with SmartBag and unlock the true potential of your mind.'
];

// place files you want to import through the `$lib` alias in this folder.
const user = writable<any>();

export const toastSignal = writable<string>()

export default user