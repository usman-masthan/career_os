const { supabase } = require('../supabaseClient');

/** Return one public skill and every public record that supports it. */
async function getVisibleSkillEvidence(slug) {
    if (!supabase) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend/.env');
    }

    const { data: skill, error: skillError } = await supabase
        .from('skills')
        .select('id, slug, name, category, description, proficiency, featured, verification_status, verification_url')
        .eq('slug', slug)
        .eq('visibility', 'public')
        .maybeSingle();

    if (skillError) throw skillError;
    if (!skill) return null;

    const [projectsResult, credentialsResult, achievementsResult] = await Promise.all([
        supabase
            .from('project_skills')
            .select(`context, featured, project:projects!inner(
                id, slug, title, summary, project_url, featured, verification_status, verification_url
            )`)
            .eq('skill_id', skill.id)
            .eq('projects.visibility', 'public'),
        supabase
            .from('credential_skills')
            .select(`credential:credentials!inner(
                id, name, issuer, issued_at, expires_at, credential_url, featured, verification_status, verification_url
            )`)
            .eq('skill_id', skill.id)
            .eq('credentials.visibility', 'public'),
        supabase
            .from('achievements')
            .select('id, title, description, achieved_at, featured, verification_status, verification_url')
            .eq('skill_id', skill.id)
            .eq('visibility', 'public')
            .order('achieved_at', { ascending: false }),
    ]);

    const failed = [projectsResult, credentialsResult, achievementsResult].find((result) => result.error);
    if (failed) throw failed.error;

    const projects = projectsResult.data.map(({ project, context, featured }) => ({
        ...project,
        skill_context: context,
        skill_featured: featured,
        evidence: [],
    }));
    const projectIds = projects.map((project) => project.id);
    if (projectIds.length) {
        const { data: evidence, error: evidenceError } = await supabase
            .from('project_evidence')
            .select('id, project_id, title, description, evidence_type, url, featured, verification_status, verification_url')
            .in('project_id', projectIds)
            .eq('visibility', 'public')
            .order('featured', { ascending: false });
        if (evidenceError) throw evidenceError;
        const byProject = evidence.reduce((groups, item) => {
            groups[item.project_id] = [...(groups[item.project_id] || []), item];
            return groups;
        }, {});
        projects.forEach((project) => { project.evidence = byProject[project.id] || []; });
    }

    return {
        ...skill,
        projects,
        credentials: credentialsResult.data.map(({ credential }) => credential),
        achievements: achievementsResult.data,
    };
}

module.exports = { getVisibleSkillEvidence };
