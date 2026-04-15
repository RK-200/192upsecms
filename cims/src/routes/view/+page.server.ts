import { supabase } from '$lib/supabaseInit';
import { redirect } from '@sveltejs/kit';
import type {PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, locals: { supabase, safeGetSession }}) => {
	const {session} = await safeGetSession()
    if (!session) {
        redirect(303, '/')
    }

    const { data : access } = await supabase
    .from('profiles')
    .select(`access_level, id`)
    .eq('id', session.user.id)
    .single()

	const year = url.searchParams.get('year') || 'All';
    const type = url.searchParams.get('type') || 'All';
    const status = url.searchParams.get('status') || 'All';
    const search = url.searchParams.get('search') || '';
	const sort = url.searchParams.get('sort') || 'title-asc';

	let query = supabase.from('contracts').select('*');

	if (year !== 'All') {
        const startDate = `${year}-01-01T00:00:00`;
        const endDate = `${year}-12-31T23:59:59`;
        
        query = query.gte('created_at', startDate)
                     .lte('created_at', endDate);
    }
	
	if (type !== 'All') {
		query = query.filter('type', 'eq', type);
	}

	if (status !== 'All') {
		query = query.filter('status', 'eq', status);
	}

	if (search !== '') {
		query = query.ilike('title', `%${search}%`);
	}

	if (sort) {
		const [sortKey, sortOrder] = sort.split('-');
		query = query.order(sortKey, { ascending: sortOrder === 'asc' });
	}
	

	const { data, error } = await query;

	if (error) {
		console.error(error);
		return { contracts: [], filters: { year, type, status }};
	}


	const { data: users } = await supabase
        .from('profiles')
        .select('id, username, access_level')
        .in('access_level', ['Workflow Manager', 'Contract Manager']);

	return {
		access : access?.access_level,
		contracts: data,
		filters: { year, type, status, search },
		session_id: access?.id,
		users: users ?? []
	};
}
