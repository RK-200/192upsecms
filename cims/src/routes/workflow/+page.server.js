import { supabase } from '$lib/supabaseInit';

export async function load() {
    const { data, error } = await supabase
        .from('workflows')
        .select('*');

    //console.log(data);

    if (error) {
        console.error(error);
        return { workflows: [] };
    }

    return {
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

        console.log("WAAAAAH")
	}
}