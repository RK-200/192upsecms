import { supabase } from "$lib/supabaseInit";
import { error } from '@sveltejs/kit';

export async function load({ params }) {
    const { data: contract, error: dbError } = await supabase
        .from('contracts')
        .select(`
            *,
            contract_preworks ( checklist ),
            contract_approvals ( checklist ),
            contract_activations ( parties ),
            contract_postworks ( checklist ) 
        `)
        .eq('id', params.id)
        .single(); 

    if (dbError) {
        console.error("Supabase Error:", dbError);
    }

    if (dbError || !contract) {
        throw error(404, 'Contract not found');
    }

    const prework = contract.contract_preworks?.[0]?.checklist || [];
    const approvals = contract.contract_approvals?.[0]?.checklist || { stages: [] }; 
    const activations = contract.contract_activations?.[0]?.parties || [];
    const postwork = contract.contract_postworks?.[0]?.checklist || { milestones: [], termination: { type: "", reason: "" } };

    return {
        contract,
        prework,
        approvals,
        activations,
        postwork
    };
}