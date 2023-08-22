import supabase from './supabase';
import { getToastStore } from '@skeletonlabs/skeleton';
const toastStore = getToastStore();

export const fetchTableDataFromUserId = async (tableName: string, user_id: string) => {
	let response = await supabase.from(tableName).select('*').eq('user_id', user_id);

	if (response.data) {
		return response.data;
	}
};

export const fetchNoteFromId = async (noteId: string) => {
	let response = await supabase.from('notes').select('*').eq('id', noteId);
	if (response.data) {
		return response.data;
	}
};

export const updateNoteFromId = async (noteId: number, note:string) => {
	const { data, error } = await supabase
		.from('notes')
		.update({ content:  note})
		.eq('id', noteId)
		.select();
    if (error){
        console.error(error);
        return
    }
    if (data) {
        return data;
    }
};

export const errorToast = (message: string) => {
	toastStore.trigger({
		message: message,
		background: 'variant-filled-warning',
		autohide: true
	});
};

export const successToast = (message: string) => {
	toastStore.trigger({
		message: message,
		background: 'variant-filled-success',
		autohide: true
	});
};


export function httpCall(method: string, url: string, body: any) {
	fetch(url, {
		method: method,
		mode: "cors",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: body
	}).then(response => response.json()).then(data => {
		console.log(data);
		if(data?.detail){
			errorToast("Login failed with message :" + data.detail);
		}

		if(data?.access_token){
			localStorage.setItem("token", data.access_token);
			window.location.href = "/";
		}
	}).catch(error => {console.log(error)})
}