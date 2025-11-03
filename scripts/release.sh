#!/bin/bash

# Release script for @lynchzdev/react-confetti-shooter
# Usage: ./scripts/release.sh [patch|minor|major|version]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Make sure you're in the project root."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    print_error "Git working directory is not clean. Please commit or stash changes first."
    git status --short
    exit 1
fi

# Check if we're on main/master branch
BRANCH=$(git branch --show-current)
if [ "$BRANCH" != "main" ] && [ "$BRANCH" != "master" ]; then
    print_warning "You're not on main/master branch (current: $BRANCH)"
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Get version type
VERSION_TYPE=${1:-patch}

if [ "$VERSION_TYPE" = "--help" ] || [ "$VERSION_TYPE" = "-h" ]; then
    echo "Usage: $0 [patch|minor|major|version]"
    echo ""
    echo "Examples:"
    echo "  $0 patch          # 1.1.1 -> 1.1.2"
    echo "  $0 minor          # 1.1.1 -> 1.2.0"
    echo "  $0 major          # 1.1.1 -> 2.0.0"
    echo "  $0 1.2.3          # Set specific version"
    echo ""
    exit 0
fi

# Get current version
CURRENT_VERSION=$(node -p "require('./package.json').version")
print_status "Current version: $CURRENT_VERSION"

# Calculate new version
if [[ "$VERSION_TYPE" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    NEW_VERSION=$VERSION_TYPE
    print_status "Setting version to: $NEW_VERSION"
else
    case $VERSION_TYPE in
        patch|minor|major)
            print_status "Bumping $VERSION_TYPE version..."
            ;;
        *)
            print_error "Invalid version type: $VERSION_TYPE"
            print_error "Use: patch, minor, major, or a specific version (e.g., 1.2.3)"
            exit 1
            ;;
    esac
fi

# Confirm release
echo ""
print_warning "This will:"
echo "  1. Update package.json version"
echo "  2. Build the package"
echo "  3. Commit changes"
echo "  4. Create and push git tag"
echo "  5. Trigger GitHub Actions to publish to NPM"
echo ""
read -p "Continue with release? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Release cancelled."
    exit 0
fi

# Update version in package.json
print_status "Updating package.json version..."
if [[ "$VERSION_TYPE" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    npm version $NEW_VERSION --no-git-tag-version
else
    npm version $VERSION_TYPE --no-git-tag-version
fi

# Get the new version (in case npm calculated it)
NEW_VERSION=$(node -p "require('./package.json').version")
print_success "Version updated to: $NEW_VERSION"

# Build the package
print_status "Building package..."
bun run build

if [ $? -ne 0 ]; then
    print_error "Build failed!"
    exit 1
fi

print_success "Build completed successfully"

# Add changes to git
print_status "Committing changes..."
git add package.json

# Check if there are changes to commit
if [ -z "$(git diff --cached)" ]; then
    print_warning "No changes to commit"
else
    git commit -m "chore: bump version to $NEW_VERSION"
    print_success "Changes committed"
fi

# Create and push tag
TAG_NAME="v$NEW_VERSION"
print_status "Creating tag: $TAG_NAME"
git tag -a $TAG_NAME -m "Release version $NEW_VERSION"

print_status "Pushing changes and tag to GitHub..."
git push origin $BRANCH
git push origin $TAG_NAME

print_success "Tag $TAG_NAME pushed successfully!"

echo ""
print_success "🎉 Release process completed!"
echo ""
print_status "GitHub Actions will now:"
echo "  - Build the package"
echo "  - Publish to NPM as @lynchzdev/react-confetti-shooter@$NEW_VERSION"
echo "  - Create a GitHub release"
echo ""
print_status "Monitor the progress at:"
echo "  https://github.com/LynchzDEV/react-confetti-shooter/actions"
echo ""
print_status "Once published, users can install with:"
echo "  npm install @lynchzdev/react-confetti-shooter@$NEW_VERSION"
echo "  bun add @lynchzdev/react-confetti-shooter@$NEW_VERSION"
