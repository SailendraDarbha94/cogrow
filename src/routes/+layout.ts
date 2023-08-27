import USER from "$lib/store";
import supabase from "$utils/supabase";
import type { LayoutLoad } from "./$types";

export const load: LayoutLoad = async ({ url }) => {
    const { data, error } = await supabase.auth.getSession()
    const user = await data.session?.user
    const token = await data.session?.access_token
    localStorage.setItem('token', token as string)
    if (error) {
        console.error(error)
    }

    //localStorage.setItem("token", token as string)
    //cookies.set("token", token as string)

    if(user) {
        USER.set(user)
    }

    return {
        url: url.pathname,
        user: user
    }

};