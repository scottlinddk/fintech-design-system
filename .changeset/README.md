# Changesets

Every PR that changes the public API, tokens, themes or CSS shipped in the npm package needs a changeset:

```bash
npx changeset
```

Pick the SemVer bump (patch/minor/major) and describe the change for consumers. Commit the generated file with the PR.
Docs-, CI- or test-only PRs do not need one (`npx changeset --empty`).

On merge to `main`, the Release workflow opens or updates a "Version Packages" PR. Merging that PR publishes to npm.
