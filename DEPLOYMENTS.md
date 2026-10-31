# Deployment history

## WARP-20261031-01

- Date: 2026-10-31, Europe/Moscow.
- Repository: https://github.com/nellimonix/warp-config-generator-vercel
- Scope: Exact origin comparisons in the fetch mock in tests/generators.test.cjs. Application code is unchanged.
- Source code commit: a6b753071776636656d5d4a93beed4a93f5fd193
- Previous production commit: fbfdf90592e9bff4f5669924412d3b82e01bc075
- Production code commit: 59eb8e0eefb7c16f4aecf875191ef33b72f38b8b
- Result: Pushed to origin/production; Docker builds for linux/amd64 and linux/arm64 and manifest publication succeeded.
- Published image tags: ghcr.io/nellimonix/warp-config-generator-vercel:59eb8e0eefb7c16f4aecf875191ef33b72f38b8b and ghcr.io/nellimonix/warp-config-generator-vercel:latest.
- Workflow: https://github.com/nellimonix/warp-config-generator-vercel/actions/runs/41154694989
- Digest artifact IDs: 13024702720 (digests-linux-arm64), 13024247601 (digests-linux-amd64).
- Validation: All 5 tests in tests/generators.test.cjs passed on production with Node.js and --conditions=react-server; git diff --check passed; the test file matches master; remote production SHA was verified.
- Alert: https://github.com/nellimonix/warp-config-generator-vercel/security/code-scanning/3 remains fixed after the master CodeQL analysis.
- Approval reference: Owner messages in the current Codex conversation approving the result, «Коммит пуш и предупреждение отметь как решенное, а так же загляни в ветку production и посмотрети есть ли там такая же проблема», and the production transfer, «Продакшен тоже сделай пж». A conversation URL is unavailable.
- Dependencies: None.
- Runtime deployment: No server or Vercel runtime was changed; this release updates the production branch and its Docker artifacts.
- Registry reconciliation: Removed WARP-20261031-01 with source code commit a6b753071776636656d5d4a93beed4a93f5fd193 from PENDING_PRODUCTION.md after successful publication.
