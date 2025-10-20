# 🔄 Sprint Workflow Guide

## Quick Reference for Sprint-Based Development

### 📋 Current Status
- ✅ **Sprint 0**: Complete (Infrastructure setup)
- 🚀 **Sprint 1**: In Progress (AI Model) - `sprint-1-ai-model` branch
- 📅 **Sprint 2**: Pending (Database Schema)

---

## 🌿 Branch Structure

```
master (main branch - production ready)
  │
  ├── sprint-1-ai-model
  ├── sprint-2-database-schema
  ├── sprint-3-api-authentication
  ├── sprint-4-api-bookings
  ├── sprint-5-api-admin
  ├── sprint-6-customer-frontend
  ├── sprint-7-admin-frontend
  ├── sprint-8-payment-integration
  ├── sprint-9-testing
  └── sprint-10-deployment
```

---

## 🚀 Starting a New Sprint

### Step 1: Switch to master and ensure it's up to date
```bash
git checkout master
git pull origin master
```

### Step 2: Create new sprint branch
```bash
# Example for Sprint 2
git checkout -b sprint-2-database-schema
```

### Step 3: Verify you're on the correct branch
```bash
git branch
# You should see * next to sprint-2-database-schema
```

---

## 💻 During Sprint Development

### Making Changes
1. Work on your features/tasks
2. Test your changes locally
3. Commit regularly with meaningful messages

### Committing Changes
```bash
# Stage your changes
git add .

# OR stage specific files
git add services/ai-model/main.py

# Commit with meaningful message
git commit -m "feat: implement YOLO v8 object detection"

# Push to remote repository
git push origin sprint-1-ai-model
```

### Commit Message Conventions
```
feat:     New feature
fix:      Bug fix
docs:     Documentation only
refactor: Code restructuring
test:     Adding tests
chore:    Maintenance
perf:     Performance improvement
style:    Code style/formatting
```

### Examples:
```bash
git commit -m "feat: add image preprocessing pipeline"
git commit -m "fix: resolve memory leak in batch processing"
git commit -m "docs: update API documentation for detect endpoint"
git commit -m "test: add unit tests for volume calculation"
git commit -m "refactor: optimize model inference speed"
```

---

## ✅ Completing a Sprint

### Step 1: Final commit and push
```bash
# Make sure all changes are committed
git add .
git commit -m "feat: complete AI model implementation with all endpoints"
git push origin sprint-1-ai-model
```

### Step 2: Switch to master
```bash
git checkout master
git pull origin master
```

### Step 3: Merge sprint branch to master
```bash
git merge sprint-1-ai-model
```

### Step 4: Resolve any conflicts (if they exist)
```bash
# If conflicts occur, edit the conflicted files
# Then:
git add .
git commit -m "merge: resolve conflicts from sprint-1-ai-model"
```

### Step 5: Tag the release
```bash
git tag -a v1.0-sprint1 -m "Sprint 1: AI Model Implementation Complete"
```

### Step 6: Push to remote
```bash
git push origin master
git push origin --tags
```

### Step 7: (Optional) Delete sprint branch if no longer needed
```bash
# Delete local branch
git branch -d sprint-1-ai-model

# Delete remote branch
git push origin --delete sprint-1-ai-model
```

---

## 📊 Checking Status

### View current branch
```bash
git branch
```

### View all branches (including remote)
```bash
git branch -a
```

### View commit history
```bash
git log --oneline
```

### View changes
```bash
# Unstaged changes
git diff

# Staged changes
git diff --staged

# Changes between branches
git diff master sprint-1-ai-model
```

### View tags
```bash
git tag
```

---

## 🔍 Useful Commands

### Switch between branches
```bash
git checkout master
git checkout sprint-1-ai-model
```

### Create and switch to new branch in one command
```bash
git checkout -b sprint-2-database-schema
```

### Stash changes (save work without committing)
```bash
# Save current work
git stash

# List stashes
git stash list

# Apply most recent stash
git stash pop
```

### Undo last commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Discard all local changes
```bash
git reset --hard HEAD
```

### View file in another branch without switching
```bash
git show sprint-1-ai-model:services/ai-model/main.py
```

---

## 🎯 Sprint Checklist

### Before Starting Sprint
- [ ] Reviewed sprint goals in SPRINT_PLAN.md
- [ ] On master branch and up to date
- [ ] Created sprint branch
- [ ] Understood all tasks

### During Sprint
- [ ] Regular commits with clear messages
- [ ] Push to remote regularly
- [ ] Test changes locally
- [ ] Update documentation if needed
- [ ] Code reviewed (if team)

### Before Completing Sprint
- [ ] All tasks completed
- [ ] All tests passing
- [ ] Documentation updated
- [ ] No merge conflicts
- [ ] Code reviewed and approved

### After Completing Sprint
- [ ] Merged to master
- [ ] Tagged release
- [ ] Pushed to remote
- [ ] Updated sprint status in SPRINT_PLAN.md
- [ ] Deleted sprint branch (optional)

---

## 🚨 Common Issues

### Issue: "Your branch is behind origin/master"
**Solution:**
```bash
git pull origin master
```

### Issue: Merge conflicts
**Solution:**
1. Open conflicted files
2. Look for conflict markers: `<<<<<<<`, `=======`, `>>>>>>>`
3. Edit files to resolve conflicts
4. Remove conflict markers
5. `git add .`
6. `git commit -m "merge: resolve conflicts"`

### Issue: Committed to wrong branch
**Solution:**
```bash
# If you haven't pushed yet
git checkout correct-branch
git cherry-pick <commit-hash>
git checkout wrong-branch
git reset --hard HEAD~1
```

### Issue: Need to switch branches but have uncommitted changes
**Solution:**
```bash
git stash
git checkout other-branch
# Do your work
git checkout original-branch
git stash pop
```

---

## 📞 Quick Help

### Show current status
```bash
git status
```

### Show recent commits
```bash
git log --oneline -10
```

### Show all branches
```bash
git branch -a
```

### Show remote URLs
```bash
git remote -v
```

---

## 🎓 Best Practices

1. **Commit Often**: Small, frequent commits are better than large ones
2. **Meaningful Messages**: Write clear commit messages
3. **Test Before Commit**: Always test your changes
4. **Pull Before Push**: Update your branch before pushing
5. **One Sprint = One Branch**: Keep sprint work isolated
6. **Tag Milestones**: Tag each completed sprint
7. **Clean History**: Avoid messy merge commits when possible
8. **Document Changes**: Update docs as you code

---

## 📈 Sprint Progress Tracking

### Check Sprint Progress
```bash
# View commits in current sprint branch
git log master..sprint-1-ai-model --oneline

# View files changed
git diff --name-only master sprint-1-ai-model

# View detailed diff
git diff master sprint-1-ai-model
```

### Update SPRINT_PLAN.md
After completing tasks, update the checkbox:
```markdown
- [x] Task completed
- [ ] Task pending
```

---

## 🎯 Current Sprint Commands (Sprint 1)

```bash
# You are currently on: sprint-1-ai-model
# Working on: AI Model Implementation

# Commit your work
git add .
git commit -m "feat: your feature description"
git push origin sprint-1-ai-model

# When sprint is complete
git checkout master
git merge sprint-1-ai-model
git tag -a v1.0-sprint1 -m "Sprint 1 Complete"
git push origin master --tags
```

---

**Last Updated**: October 21, 2025  
**Current Branch**: `sprint-1-ai-model`  
**Next Sprint**: Sprint 2 - Database Schema
