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