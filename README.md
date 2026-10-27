# CI Proof

[![CI](https://github.com/locomotive-brain/ci-proof/actions/workflows/ci.yml/badge.svg)](https://github.com/locomotive-brain/ci-proof/actions/workflows/ci.yml)
[![Security](https://github.com/locomotive-brain/ci-proof/actions/workflows/security.yml/badge.svg)](https://github.com/locomotive-brain/ci-proof/actions/workflows/security.yml)
[![Docker](https://github.com/locomotive-brain/ci-proof/actions/workflows/docker.yml/badge.svg)](https://github.com/locomotive-brain/ci-proof/actions/workflows/docker.yml)

**A CI/CD harness that proves itself, running live.** This is not a slide deck about
testing discipline — it's a small, real, two-language codebase wired to the harness we
install on a client's own repo, running green on every push. Watch it work:
[Actions tab](https://github.com/locomotive-brain/ci-proof/actions).

## What this proves

A fixed-price CI/CD engagement from us ships with this, adapted to your stack:

- **Matrix testing** across the language runtimes you actually support (here: Node 20/22,
  Python 3.11/3.12), with dependency caching so a run is fast, not just correct.
- **Lint + format + typecheck**, every push and PR — ESLint/Prettier/tsc for TypeScript,
  Ruff/mypy for Python.
- **Unit and integration tests, with a hard coverage floor** (80%, actually met here — no
  skipped tests, no padded numbers).
- **Dependency vulnerability scanning** (`npm audit`, `pip-audit`) on every run, plus
  **CodeQL** static analysis and **Dependency Review** on pull requests, plus a
  **secret scan** (gitleaks) so a leaked key never lands on `main`.
- **Container build + healthcheck + vulnerability scan** (Trivy, fails the build on any
  CRITICAL finding) for the Node service's Docker image.
- **A `required-checks` job** that gates merge on everything above passing — one green
  checkmark a branch-protection rule can actually point at.
- **Dependabot**, grouped and weekly, so dependencies stay green after we leave — this is
  the retainer hook: someone has to keep merging those PRs.

## What a fixed-price engagement includes

1. We stand up this exact harness against your repo: your languages, your test runner,
   your coverage floor.
2. We wire the security scanning your stack needs (SAST, secret scanning, dependency
   review, container scanning if you ship one).
3. We get it green, end to end, before we call it done — a red pipeline handed back to you
   is not a deliverable.
4. You get the PR, the Actions run link, and a plain-English note on what each gate catches
   and what to do when one goes red.

## How we work

My studio uses automated verification and AI tooling; you get a green test suite and a
human review before delivery.

## See it run

- [Actions](https://github.com/locomotive-brain/ci-proof/actions) — every workflow run,
  live.
- [`node-service/`](./node-service) — the TypeScript sample: an Express quote calculator
  with unit tests, an HTTP integration test, and a Dockerfile with a real healthcheck.
- [`python-service/`](./python-service) — the Python sample: an invoice calculator with
  the same shape of tests.
- [`TEMPLATE.md`](./TEMPLATE.md) — how we adapt this harness to a client repo.

---

This repository is currently owned by the `locomotive-brain` GitHub account and will be
transferred to its owner's personal account; GitHub redirects the old URLs automatically
once that happens, so the links and badges above keep working.

<!-- CI verification: confirms PR-triggered workflows (dependency-review included) run green. -->
