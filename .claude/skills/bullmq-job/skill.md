---
name: bullmq-job
description: Add a new BullMQ job type to the briefly worker with proper typing
user-invocable: true
arguments:
  - name: job-name
    description: The job name in kebab-case (e.g. "summarize-channel", "extract-action-items")
    required: true
---

Add a new BullMQ job definition to the briefly worker for `$ARGUMENTS`.

**Project context:**
- Worker app: `apps/worker/`
- Redis client: expected in `packages/redis/` (create if not yet done)
- Queue jobs are processed via BullMQ Workers

**Steps:**

1. **Define the job payload type** in `apps/worker/src/jobs/<job-name>.ts`:
   ```ts
   export type <JobName>Payload = { ... }  // infer from job name + context

   export const <JOB_NAME>_QUEUE = '<job-name>'

   export async function process<JobName>(job: Job<<JobName>Payload>) {
     // TODO: implement
   }
   ```

2. **Register the worker** in `apps/worker/src/index.ts`:
   - Import the processor and queue name
   - Instantiate a `new Worker(QUEUE_NAME, processor, { connection })` using the shared Redis connection

3. **Expose the queue name and payload type** from `packages/redis/` (if it exists) so the API can enqueue jobs with full type safety. If `packages/redis` doesn't exist yet, create it with:
   - `packages/redis/src/queues/<job-name>.ts` — shared constants + types
   - `packages/redis/src/index.ts` — barrel export
   - `packages/redis/package.json` — minimal ESM + CJS dual export, following `packages/db/package.json` pattern

**After creating files:**
- If `@briefly/redis` package was created/modified, remind the user to run `pnpm install` at repo root
- Add the queue name to any central queue registry if one exists

Use `$ARGUMENTS` as the job name.
