import { env } from '$env/dynamic/public';
import { toastSignal } from '$lib/store';


export async function upload_file(file: File) {
	const formData = new FormData();
    const token:string = localStorage.getItem('token') as string
	console.log('uploading file');
	formData.append('upload_file', file);
	fetch(`${env.PUBLIC_BACKEND_URL}/files/upload_file/`, {
		method: 'POST',
		body: formData,
		headers: {
			accept: 'application/json',
			Authorization: token
		}
	})
		.then(async (data:Response) => {
			//const DATA = await data.json()
			//console.log('DATA  :  ', DATA);
            await data.json
            toastSignal.update((value:string) => value = "")
		}).then((data:any) => {
            console.log(data)
        })
		.catch((err: Response) => {
			toastSignal.update((value:string) => value = 'An Error occurred')
			console.log(err);
		});
}


export default upload_file