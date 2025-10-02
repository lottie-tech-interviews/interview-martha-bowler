#!/bin/bash

# Script to create a new repository copy for a candidate
# This creates a fresh copy without git history

set -e  # Exit on any error

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

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) is not installed. Please install it first:"
    echo "  brew install gh"
    echo "  or visit: https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated with GitHub CLI
if ! gh auth status &> /dev/null; then
    print_error "Not authenticated with GitHub CLI. Please run:"
    echo "  gh auth login"
    exit 1
fi

# Get current directory (should be the coding-ai-interview repo)
CURRENT_DIR=$(pwd)
REPO_NAME=$(basename "$CURRENT_DIR")

# Check if we're in the right directory
if [ "$REPO_NAME" != "coding-ai-interview" ]; then
    print_warning "Current directory is '$REPO_NAME', expected 'coding-ai-interview'"
    print_warning "Make sure you're running this script from the coding-ai-interview repository root"
fi

# Ask for candidate name
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Candidate Repository Creator${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

read -p "Enter candidate name (e.g., 'john-doe'): " CANDIDATE_NAME

# Validate candidate name (alphanumeric, hyphens, underscores only)
if [[ ! "$CANDIDATE_NAME" =~ ^[a-zA-Z0-9_-]+$ ]]; then
    print_error "Invalid candidate name. Only alphanumeric characters, hyphens, and underscores are allowed."
    exit 1
fi

# Create new repository name
NEW_REPO_NAME="interview-$CANDIDATE_NAME"
ORG_NAME="lottie-tech-interviews"

print_status "Creating repository: $ORG_NAME/$NEW_REPO_NAME"

# Create a temporary directory for the new repo
TEMP_DIR=$(mktemp -d)
print_status "Using temporary directory: $TEMP_DIR"

# Copy all files except .git directory
print_status "Copying repository files..."
rsync -av --exclude='.git' --exclude='node_modules' --exclude='dist' --exclude='*.log' "$CURRENT_DIR/" "$TEMP_DIR/"

# Change to temp directory
cd "$TEMP_DIR"

# Initialize new git repository
print_status "Initializing new git repository..."
git init
git add .
git commit -m "Initial commit for candidate: $CANDIDATE_NAME"

# Create repository on GitHub
print_status "Creating repository on GitHub..."
gh repo create "$ORG_NAME/$NEW_REPO_NAME" --public --description "Coding AI Interview for candidate: $CANDIDATE_NAME"

# Add remote and push
print_status "Pushing to GitHub..."
git remote add origin "https://github.com/$ORG_NAME/$NEW_REPO_NAME.git"
git branch -M main
git push -u origin main

# Clean up temporary directory
print_status "Cleaning up..."
cd "$CURRENT_DIR"
rm -rf "$TEMP_DIR"

print_success "Repository created successfully!"
print_success "Repository URL: https://github.com/$ORG_NAME/$NEW_REPO_NAME"
print_success "Candidate: $CANDIDATE_NAME"

echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Share the repository URL with the candidate"
echo "2. Invite the candidate to the repository: https://github.com/$ORG_NAME/$NEW_REPO_NAME/settings/access"
echo "3. The candidate can clone it with:"
echo "   git clone https://github.com/$ORG_NAME/$NEW_REPO_NAME.git"
echo "4. They can then follow the README instructions to get started"
