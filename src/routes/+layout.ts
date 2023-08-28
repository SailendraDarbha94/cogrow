import USER from "$lib/store";
import supabase from "$utils/supabase";
import type { LayoutLoad } from "./$types";
import { browser } from "$app/environment"
import { redirect } from "@sveltejs/kit";

export const load: LayoutLoad = async ({ url }) => {
    const { data, error } = await supabase.auth.getSession()
    const user = await data.session?.user
    const token = await data.session?.access_token


    if(browser){
        localStorage.setItem('token', token as string)
    }
    if (error) {
        console.error(error)
        //throw redirect(302, `/`)
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