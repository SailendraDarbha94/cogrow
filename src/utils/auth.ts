
import user from "$lib/store";
import supabase from "$utils/supabase";

export const checkAuthAndSetToken = async () => {
    const { data, error } = await supabase.auth.getSession()
    // if (error) {
    //     return errorToast("An Error has occurred while saving auth Token")
    // }
    if(!data) {
        localStorage.removeItem("token")
        user.set(null)
    }
    if (data) {
        console.log(data.session?.access_token)
        localStorage.setItem("token", data.session?.access_token as string)
        user.set(data.session?.user)
    }
    return data.session?.user
};