import { supabase } from '$lib/supabaseInit';

export async function load() {
	const { data, error } = await supabase
		.from('contracts')
		.select('*');

	//console.log(data);

	if (error) {
		console.error(error);
		return { contracts: [] };
	}

	return {
		contracts: data
	};
}
