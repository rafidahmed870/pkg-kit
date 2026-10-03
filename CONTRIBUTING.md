# Contributing

Thanks for your interest in contributing to **pkg-kit**. We're happy to have you here.

Please take a moment to review this document before submitting your first pull request. We also strongly recommend that you check for open issues and pull requests to see if someone else is working on something similar.

---

## About This Repository

**pkg-kit** is a scaffolding tool for creating publish-ready JavaScript and TypeScript npm packages. It provides a customizable project setup with common tooling for building, testing, linting, formatting, and publishing.

---

## Development

### Fork This Repo

You can fork this repo by clicking the fork button in the top right corner of this page.

### Clone on your local machine

```bash
git clone https://github.com/rafidahmed870/pkg-kit.git
```

### Navigate to project directory

```
cd pkg-kit
```

### Create a new Branch

```
git checkout -b your-branch-name
```

### Install dependencies

```
npm install
```

---

## Commit Messages

We use Conventional Commits for our commit messages.

### Commit Types

- `feat` — New feature
- `fix` — Bug fix
- `docs` — Documentation changes
- `refactor` — Code changes that do not add a feature or fix a bug
- `test` — Adding or updating tests
- `perf` — Performance improvements
- `chore` — Maintenance, dependencies, or configuration changes

### Format

```
<type>(<scope>): <subject>
```

### Examples

```
feat(worker): add configurable concurrency
fix(storage): prevent duplicate job claims
docs(readme): update storage adapter examples
test(queue): add retry behavior tests
refactor(core): simplify job lifecycle handling
perf(worker): optimize job polling
chore(deps): update dependencies
```

---

## Testing

Tests are written using [Vitest](https://vitest.dev/). You can run all the tests from the root of the repository.

```
pnpm test
```

Please ensure that the tests are passing when submitting a pull request. If you're adding new features, please include tests.
