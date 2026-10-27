# CI Proof

[![CI](https://github.com/cedarwood-studio/ci-proof/actions/workflows/ci.yml/badge.svg)](https://github.com/cedarwood-studio/ci-proof/actions/workflows/ci.yml)
[![Security](https://github.com/cedarwood-studio/ci-proof/actions/workflows/security.yml/badge.svg)](https://github.com/cedarwood-studio/ci-proof/actions/workflows/security.yml)
[![Docker](https://github.com/cedarwood-studio/ci-proof/actions/workflows/docker.yml/badge.svg)](https://github.com/cedarwood-studio/ci-proof/actions/workflows/docker.yml)

Your pipeline is written for your repo and stack; this one is ours, kept green as a
working example. Every client harness is cross-checked against our checklist. This repo
isn't something we install on your project: it's a small, real, two-language codebase
that shows the kind of harness we build and proves the discipline behind it, live, on
every push.

## What we check (categories, not implementation)

Every client harness (adapted to your languages, your test runner, your stack) is
checked against the same internal list, organized by what it's checking rather than how:

| Category | Kinds of checks |
|---|---|
| **Pipeline structure** | Triggers, concurrency handling, dependency caching, matrix strategy, a single merge-gating job |
| **Correctness gates** | Lint, typecheck, unit/integration/regression tests, a negotiated coverage floor, a stated flaky-test policy, migration-apply verification |
| **Security** | Secret scanning, dependency vulnerability scanning, SAST/static analysis, container scanning, least-privilege permissions, pinned actions |
| **Supply chain** | Lockfile discipline, automated dependency updates, provenance/attestations where cheap, behavioral/malicious-package scanning, an install-time minimum-release-age floor |
| **Deploy safety** | Environments and reviewers, a named rollback path, no production credentials from us |
| **Deploy verification** | Post-deploy checks against the live deployed artifact, real-browser checks against a deployed preview |
| **Observability** | Status badges, run summaries, artifact retention, schedule-vs-run-history reconciliation |
| **Maintainability** | A handoff doc, clear naming, one gate a branch-protection rule can point at |

The checklist itself isn't published (it's our working document, and it keeps changing
as we learn), but the categories above are exactly what gets run through on every
engagement, scoped to the proof rung the job actually needs (charter D30's proof ladder:
lowest rung the stakes require, never a fortnight of harness for a one-day task).

## See it run

- [Actions](https://github.com/cedarwood-studio/ci-proof/actions): every workflow run,
  live.
- [`node-service/`](./node-service): the TypeScript sample: an Express quote calculator
  with unit tests, an HTTP integration test, and a Dockerfile with a real healthcheck.
- [`python-service/`](./python-service): the Python sample: an invoice calculator with
  the same shape of tests.
- [`TEMPLATE.md`](./TEMPLATE.md): how we adapt this harness's *shape* to a client repo;
  it is never pasted in wholesale.

## How we work

My studio uses automated verification and AI tooling; you get a green test suite and a
human review before delivery.

---

This repository is currently owned by the `locomotive-brain` GitHub account and will be
transferred to its owner's personal account; GitHub redirects the old URLs automatically
once that happens, so the links and badges above keep working.
