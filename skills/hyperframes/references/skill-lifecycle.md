# Skill installation and freshness

Read this reference when installing or updating skills, diagnosing unexpected skill behavior, or running HyperFrames setup in CI.

For a plugin installation, follow [plugin execution rules](plugin-installation.md); the plugin manager owns updates and every skill is bundled. The commands below apply only to standalone skills.

- **Core set, installed eagerly:** `/hyperframes`, `/hyperframes-cli`, `/hyperframes-registry` and `/media-use`.
- **On demand:** `/figma`, `/slideshow` and `/remotion-to-hyperframes`, installed with `npx hyperframes skills update <name>`.

## What `init` does

`npx hyperframes init` checks GitHub and refreshes the core set plus other skills already installed. A current install is a no-op. Offline or rate-limited checks degrade gracefully and do not fail project scaffolding.

The `--skip-skills` CLI flag is temporarily ignored. CI and tests may opt out with `HYPERFRAMES_SKIP_SKILLS=1`.

`HYPERFRAMES_SKIP_SKILLS=1` also makes `skills update` (bare or named) and bare `skills` exit 0 without installing or pruning, so an install pinned to one commit stays pinned.

## Diagnose and update

```bash
npx hyperframes skills check
npx hyperframes skills check --json
npx hyperframes skills update
npx hyperframes skills update <name>
npx hyperframes skills
```

- `skills check` exits non-zero when an installed skill is stale or the core set is incomplete. Skills available on demand but not installed are not failures.
- Bare `skills update` refreshes the core set and everything already installed, and removes skills that are no longer published.
- Named `skills update <name...>` also installs those named skills.
- Bare `skills` installs the full published set explicitly.

If the HyperFrames CLI is unavailable, use `npx skills add heygen-com/hyperframes --skill <name>` for one skill or `npx skills add heygen-com/hyperframes --all` for the full published set.

The CLI may print a one-line stale-skill reminder during `render`, `lint`, or `check`. Treat a failed update as a visible tool failure; do not continue from a remembered skill.

## Keep the project's CLI current

A scaffolded project pins `hyperframes@<version>` in its `package.json` scripts so renders stay reproducible; the pin never advances on its own, and a pinned run of an older CLI prints no warning about it. When resuming a project whose scripts carry a pin, probe once before the first render-affecting command:

```bash
npx hyperframes@latest upgrade --project . --check
```

The probe is read-only and reports the pin against the latest release; keep the explicit `.` — on older CLI releases a bare `--project` followed by another flag consumes that flag as its directory value. When it reports the project behind — or any CLI output already shows it (the stderr notice `This project pins hyperframes@… (latest …)`, or `_meta.updateAvailable: true` in a `--json` result from a pinned script) — apply with `npx hyperframes@latest upgrade --project .`, then verify with `npx hyperframes check`. A passing check confirms the project's compositions still validate on the new version — not that rendered output is frame-identical to the old pin — so a successful bump is never silent: name the old and new version in the run's summary. A project with no composition yet needs no verification. If the check fails, revert the `package.json` change, continue on the pinned version, and report which version the project stays on and why. Act on the signal rather than relaying it to the user; never leave a bumped pin unverified.

## Syncing a local fork against upstream

This checkout is a fork: the baseline commit is the published skill at a known version, and the
commits on top are local methodology (review gate, rhythm, content modes) that must never be
regressed by an upstream pull. The upstream remote is configured:

```bash
git remote add upstream https://github.com/heygen-com/hyperframes.git
```

Sync procedure, at most once a quarter or before relying on a new CLI feature:

1. `git fetch upstream` and diff the skill subtree: `git diff HEAD upstream/main -- <this path>`.
2. Take only upstream fixes (contract corrections, new `check` findings, CLI facts). Never merge
   a change that rewrites local files wholesale; cherry-pick or hand-apply instead.
3. After applying anything, re-run `node --test scripts/gate.test.mjs` and one real project's
   `npx hyperframes check` before committing. A doc-only diff still needs the test run.
4. Record the upstream version the sync was taken against in the commit message.

When the machine cannot reach github.com, compare read-only through jsDelivr, which mirrors the
repo: `https://cdn.jsdelivr.net/gh/heygen-com/hyperframes@main/<path>`. That is enough to spot
contract changes in `SKILL.md` and the references; defer anything that needs a real merge until
the network is back. Do not rely on the CLI's own `_meta.updateAvailable` for this: it has been
observed reporting a stale `latestVersion` while the registry was several versions ahead.
