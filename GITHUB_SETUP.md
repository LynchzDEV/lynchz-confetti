# GitHub Setup Guide for Automatic Publishing

This guide will help you set up your GitHub repository for automatic NPM publishing when you create tags.

## Prerequisites

- GitHub repository: `https://github.com/LynchzDEV/lynchz-confetti`
- NPM account with publishing permissions
- Local git repository connected to GitHub

## Step 1: Create NPM Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click on your profile picture → "Access Tokens"
3. Click "Generate New Token" → "Classic Token"
4. Select "Automation" (recommended for CI/CD)
5. Copy the token (starts with `npm_...`)

## Step 2: Add NPM Token to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/LynchzDEV/lynchz-confetti`
2. Click "Settings" tab
3. In the left sidebar, click "Secrets and variables" → "Actions"
4. Click "New repository secret"
5. Name: `NPM_TOKEN`
6. Value: Paste your NPM token
7. Click "Add secret"

## Step 3: Push Your Code to GitHub

Make sure all your files are committed and pushed:

```bash
# Add all files
git add .

# Commit changes
git commit -m "feat: initial release setup with GitHub Actions"

# Push to GitHub (make sure remote is set)
git remote add origin https://github.com/LynchzDEV/lynchz-confetti.git
git branch -M main
git push -u origin main
```

## Step 4: Create Your First Release

### Option A: Using the Release Script (Recommended)

```bash
# Patch version (1.1.1 → 1.1.2)
bun run release:patch

# Minor version (1.1.1 → 1.2.0)
bun run release:minor

# Major version (1.1.1 → 2.0.0)
bun run release:major

# Specific version
./scripts/release.sh 1.2.0
```

### Option B: Manual Release

```bash
# Update version
npm version patch  # or minor, major, or specific version

# Build package
bun run build

# Commit changes
git add .
git commit -m "chore: bump version to $(node -p "require('./package.json').version")"

# Create and push tag
VERSION=$(node -p "require('./package.json').version")
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin main
git push origin "v$VERSION"
```

## Step 5: Monitor the Publishing Process

1. Go to your repository's "Actions" tab
2. You should see a "Publish to NPM" workflow running
3. The workflow will:
   - Build your package
   - Publish to NPM
   - Create a GitHub release

## Step 6: Verify Publication

1. Check NPM: `https://www.npmjs.com/package/@lynchzdev/react-confetti-shooter`
2. Check GitHub releases: `https://github.com/LynchzDEV/lynchz-confetti/releases`

## Troubleshooting

### Workflow Fails with "401 Unauthorized"
- Check that your `NPM_TOKEN` secret is set correctly
- Ensure the token has automation permissions
- Make sure you're the owner/maintainer of the scoped package

### Package Already Exists Error
- You can't republish the same version
- Bump the version number and try again

### Build Fails
- Check that all dependencies are properly listed
- Ensure TypeScript compiles without errors locally

## Future Releases

For future releases, simply use the release script:

```bash
# Quick patch release
bun run release:patch

# The script will:
# 1. Bump version in package.json
# 2. Build the package
# 3. Commit changes
# 4. Create and push tag
# 5. Trigger GitHub Actions
```

## Release Script Features

The `./scripts/release.sh` script includes:
- ✅ Git status checks (clean working directory)
- ✅ Branch verification (warns if not on main/master)
- ✅ Interactive confirmation
- ✅ Automatic building
- ✅ Git tagging and pushing
- ✅ Colored output and progress indicators

## Package Information

- **Package Name**: `@lynchzdev/react-confetti-shooter`
- **Repository**: `https://github.com/LynchzDEV/lynchz-confetti`
- **NPM Registry**: `https://www.npmjs.com/package/@lynchzdev/react-confetti-shooter`

Happy publishing! 🎉