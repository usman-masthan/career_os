# GitHub sync deployment

Deploy and set secrets as described in `DEPLOYMENT.md`. Then create the schedule in Supabase Dashboard → Integrations → Cron using the SQL below after saving `project_url` and `github_sync_cron_secret` in Vault:

```sql
select cron.schedule(
  'careeros-github-sync',
  '*/15 * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name='project_url') || '/functions/v1/github-sync',
    headers := jsonb_build_object(
      'content-type', 'application/json',
      'x-sync-secret', (select decrypted_secret from vault.decrypted_secrets where name='github_sync_cron_secret')
    ),
    body := '{}'::jsonb
  );
  $$
);
```

The schedule may run every 15 minutes; each account's `next_sync_at` prevents unnecessary GitHub calls. Remove the job with `select cron.unschedule('careeros-github-sync');` before rotating or disabling the function.
