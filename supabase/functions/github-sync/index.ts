import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json" },
});

Deno.serve(async (request) => {
  const cronSecret = Deno.env.get("SYNC_CRON_SECRET");
  if (!cronSecret || request.headers.get("x-sync-secret") !== cronSecret) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const githubToken = Deno.env.get("GITHUB_SYNC_TOKEN");
  const db = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const now = new Date();

  const { data: accounts, error: accountError } = await db.from("integration_accounts")
    .select("id, external_account_id, sync_interval_minutes, integrations!inner(platform)")
    .eq("status", "connected").eq("integrations.platform", "github")
    .or(`next_sync_at.is.null,next_sync_at.lte.${now.toISOString()}`);
  if (accountError) return json({ error: accountError.message }, 500);

  const results = [];
  for (const account of accounts || []) {
    const { data: run, error: runError } = await db.from("sync_runs")
      .insert({ integration_account_id: account.id, status: "running", started_at: now.toISOString() })
      .select("id").single();
    if (runError) { results.push({ account: account.id, error: runError.message }); continue; }

    try {
      const headers: Record<string, string> = {
        Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2026-03-10",
        "User-Agent": "CareerOS-GitHub-Sync",
      };
      if (githubToken) headers.Authorization = `Bearer ${githubToken}`;
      const response = await fetch(`https://api.github.com/users/${encodeURIComponent(account.external_account_id)}/repos?per_page=100&sort=updated`, { headers });
      if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
      const repos = await response.json();
      let changed = 0;
      for (const repo of repos) {
        if (repo.fork || repo.private) continue;
        const { data: existing } = await db.from("external_items").select("review_status")
          .eq("integration_account_id", account.id).eq("item_type", "repository")
          .eq("external_identifier", String(repo.id)).maybeSingle();
        const rawData = {
          name: repo.name, full_name: repo.full_name, description: repo.description,
          html_url: repo.html_url, homepage: repo.homepage, language: repo.language,
          topics: repo.topics || [], stars: repo.stargazers_count, forks: repo.forks_count,
          archived: repo.archived, pushed_at: repo.pushed_at, updated_at: repo.updated_at,
        };
        const { error } = await db.from("external_items").upsert({
          integration_account_id: account.id, source_platform: "github",
          external_identifier: String(repo.id), item_type: "repository", source_url: repo.html_url,
          raw_data: rawData, source_created_at: repo.created_at, source_updated_at: repo.updated_at,
          last_seen_at: now.toISOString(), review_status: existing?.review_status || "pending",
        }, { onConflict: "integration_account_id,item_type,external_identifier" });
        if (!error) changed += 1;
      }
      const next = new Date(now.getTime() + account.sync_interval_minutes * 60_000).toISOString();
      await Promise.all([
        db.from("sync_runs").update({ status: "succeeded", finished_at: new Date().toISOString(), items_seen: repos.length, items_changed: changed }).eq("id", run.id),
        db.from("integration_accounts").update({ last_synced_at: new Date().toISOString(), next_sync_at: next, consecutive_failures: 0, last_error_at: null }).eq("id", account.id),
      ]);
      results.push({ account: account.id, seen: repos.length, changed });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown sync error";
      const { data: current } = await db.from("integration_accounts").select("consecutive_failures").eq("id", account.id).single();
      const failures = (current?.consecutive_failures || 0) + 1;
      const retryMinutes = Math.min(1440, 15 * (2 ** Math.min(failures - 1, 6)));
      await Promise.all([
        db.from("sync_runs").update({ status: "failed", finished_at: new Date().toISOString(), error: { message } }).eq("id", run.id),
        db.from("integration_accounts").update({ consecutive_failures: failures, last_error_at: new Date().toISOString(), next_sync_at: new Date(now.getTime() + retryMinutes * 60_000).toISOString(), status: failures >= 5 ? "error" : "connected" }).eq("id", account.id),
      ]);
      results.push({ account: account.id, error: message });
    }
  }
  return json({ processed: results.length, results });
});
