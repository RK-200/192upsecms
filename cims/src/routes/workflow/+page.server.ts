import { supabase } from '$lib/supabaseInit';
import { redirect } from '@sveltejs/kit';
import type {PageServerLoad } from './$types'

export const load : PageServerLoad = async ({ locals: { supabase, safeGetSession } }) => {
    const {session} = await safeGetSession()
    if (!session) {
        redirect(303, '/')
    }

    const { data : access } = await supabase
    .from('profiles')
    .select(`access_level`)
    .eq('id', session.user.id)
    .single()

    const { data, error } = await supabase
        .from('workflows')
        .select('*');

    if (error) {
        console.error(error);
        return { workflows: [] };
    }

    return {
        access : access?.access_level,
        workflows: data
    };
}

export const actions = {
	update_name: async ({ request }) => {
		const data = await request.formData();
        const workflow_id = data.get('workflow_id')?.toString()
        const new_name = data.get('new_name')?.toString()

        const { error } = await supabase
        .from('workflows')
        .update({ name: new_name})
        .eq('id', workflow_id)
	}
}