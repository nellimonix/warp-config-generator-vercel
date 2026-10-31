# Pending production changes

## WARP-20261031-01

- Description: Compare parsed fetch URL origins in the API test mock instead of matching URL substrings. The same test needs this change on the production branch. Application code is unchanged.
- Repository: https://github.com/nellimonix/warp-config-generator-vercel
- Code commit: a6b753071776636656d5d4a93beed4a93f5fd193
- Dependencies: None.
- Validation: All 5 tests in tests/generators.test.cjs passed with Node.js and --conditions=react-server; git diff --check passed.
- Approved: 2026-10-31, Europe/Moscow.
- Approval reference: Owner message in the current Codex conversation: «Коммит пуш и предупреждение отметь как решенное, а так же загляни в ветку production и посмотрети есть ли там такая же проблема». A conversation URL is unavailable.
- Related alert: https://github.com/nellimonix/warp-config-generator-vercel/security/code-scanning/3
- Production deployment: Not authorized; pending scope approval.
