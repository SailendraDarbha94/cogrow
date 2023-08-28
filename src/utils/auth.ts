import supabase from '$utils/supabase';

export async function checkAuthAndSetToken() {
	const { data, error } = await supabase.auth.getSession();
	if (error) {
		localStorage.setItem('token', '');
		console.log(error)
	}
	if (data) {
		localStorage.setItem('token', `Bearer ${data.session?.access_token as string}`)
        console.log(data)
	}
}

export default checkAuthAndSetToken;
