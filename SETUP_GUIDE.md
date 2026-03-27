# Customer Meeting Insights — Setup & Operations Guide

## 📋 Architecture Overview

### Data Flow
```
Teams Meeting
    ↓
Microsoft Graph (Transcript + Copilot Summary)
    ↓
Azure Function / Power Automate (Converts to Markdown)
    ↓
GitHub App (Commits to customer-meeting-insights)
    ↓
VS Code Clone (Team members read via Copilot)
```

**Key Security Points:**
- ✅ No meeting data leaves Microsoft 365 without policy approval
- ✅ GitHub never accesses Teams directly
- ✅ Automation uses least-privilege credentials (GitHub App tokens with limited scope)
- ✅ Human access is role-based and revocable
- ✅ Full Git history = complete audit trail

---

## 🔧 Setup Checklist

### Phase 1: Repository Setup ✅ COMPLETED
- [x] Private repository created
- [x] Folder structure initialized
- [x] Templates and documentation added
- [x] README and security guidelines in place

### Phase 2: Access Controls
- [ ] **Collaborators Added** (Personal account alternative to Teams)
  - [ ] Nam: Write access
  - [ ] Goldie: Write access
  - [ ] Rishya: Write access
  - [ ] PE team members: Read-only (as needed)
  - **How to add:** Go to Repo → Settings → Collaborators → Add people

### Phase 3: Branch Protection
- [ ] **Main branch protection enabled**
  - [ ] Require pull request before merging
  - [ ] Prevent force pushes
  - **How to set up:** Settings → Branches → Add rule for main

### Phase 4: GitHub App for Automation
- [ ] **GitHub App created**: `customer-insights-publisher`
  - [ ] App has limited permissions (see below)
  - [ ] Installed on repository
  - [ ] Private key generated and secured

### Phase 5: IT Integration Setup (Handled by IT)
- [ ] **Azure Function or Power Automate configured**
  - [ ] Receives Teams meeting webhook
  - [ ] Calls Microsoft Graph for transcript + summary
  - [ ] Converts content to Markdown
  - [ ] Commits using GitHub App (with least-privilege token)
  - [ ] Adds files to appropriate folder: `meeting-notes/[date]/`

### Phase 6: Team Enablement
- [ ] Team members informed of repository
- [ ] Each person clones repo in VS Code
- [ ] GitHub Copilot enabled in VS Code
- [ ] Quick training: how to pull, search, use Copilot for analysis

---

## 🔐 GitHub App Permissions (Minimum Required)

The GitHub App should have permissions limited to:

```
Repository Contents:
  - Read & Write (to commit new meeting notes)

Pull Requests:
  - Read & Write (if PRs are required for automation)

Metadata:
  - Read (basic repo info)
```

**Permissions NOT needed:**
- ❌ Workflows, secrets, or environment access
- ❌ Issues or discussions
- ❌ Administrative access
- ❌ Member/user management

---

## 🛠️ How the Automation Works (IT Reference)

### Prerequisites
- GitHub App created with least-privilege scope (see above)
- Private key securely stored in Azure Keyvault
- Microsoft Graph API permissions: `User.Read.All`, `OnlineMeetings.Read` (if applicable)

### Workflow Steps

```
1. Teams Meeting Ends
   └─ Microsoft Stream/Graph detects completion

2. Fetch Meeting Data (via Graph API)
   └─ Transcript text
   └─ Copilot-generated summary
   └─ Action items

3. Format to Markdown
   └─ Create summary file in summaries/
   └─ Create raw notes file in meeting-notes/

4. Commit to GitHub
   └─ Use GitHub App token (short-lived, auto-rotating)
   └─ Commit message: "Auto: Meeting notes from [Customer] - [Date]"
   └─ Branch: Create PR to main (if branch protection enabled) OR commit directly to main

5. Clean Up
   └─ Logs stored in Azure Function logs (not in repo)
   └─ No sensitive data in Git history
```

### Error Handling
- Failed commits logged to Azure Monitor/App Insights
- IT notified via Teams/email if critical errors occur
- Manual retry available via Azure portal

---

## 👥 Access Model (Personal Account)

| Role | GitHub Access | Git Permissions | Can Approve PRs? |
|------|---|---|---|
| **Richard (Owner)** | Full | Write + Admin | Yes |
| **Nam (Writer)** | Collaborator | Write | Yes (if PR reviews enabled) |
| **Goldie (Writer)** | Collaborator | Write | Yes (if PR reviews enabled) |
| **Rishya (Writer)** | Collaborator | Write | Yes (if PR reviews enabled) |
| **PE Team (Readers)** | Collaborator | Read | No |
| **GitHub App (Automation)** | GitHub App | Write (notes only) | No |

**How Access is Revoked:**
- Personal account: Remove from Settings → Collaborators
- GitHub App: Can disable or uninstall from Settings → Installed GitHub Apps
- Both are immediate (no grace period)

---

## 🖥️ Team Usage in VS Code

### Initial Setup (Per Person)
```powershell
# Clone the repository
git clone https://github.com/richardwitzerPE/customer-meeting-insights.git
cd customer-meeting-insights

# Optional: Configure name/email for commits
git config user.name "Your Name"
git config user.email "your.email@company.com"
```

### Regular Workflow
```powershell
# Pull latest meeting notes (auto-committed by GitHub App)
git pull origin main

# Branch for edits (if PR review is enabled)
git checkout -b insight-update-[feature]

# Make changes to insights/ files
# Use Copilot: "Summarize all Q1 customer pain points"

# Commit and push
git add insights/[file].md
git commit -m "Add Q1 insights summary"
git push origin insight-update-[feature]

# Create PR (GitHub web UI)
# Wait for review, then merge
```

### Using Copilot for Analysis
In VS Code, open Copilot Chat and ask questions like:

- *"What are the top 3 feature requests across all customer meetings?"*
- *"Summarize competitive feedback for our healthcare vertical"*
- *"What implementation challenges do customers face with feature X?"*
- *"Generate a customer health scorecard from recent meetings"*

**Important:** Copilot can only see repository content (meeting notes, summaries, insights) — not the original Teams data.

---

## 📊 Audit & Compliance

### What Creates an Audit Trail
- ✅ Every commit (who, what, when)
- ✅ Every branch push
- ✅ Every PR review
- ✅ GitHub App token usage

### For Compliance Reporting
```bash
# View full commit history
git log --all --oneline

# See who changed a file
git log -p insights/product-feedback.md

# Export full history (for audit)
git log --all --pretty=format:"%h %an %ad %s" > audit_trail.txt
```

---

## 🔒 Security Reminders

**For Team Members:**
1. **Never** commit customer PII or financial details
2. **Never** share this repo URL outside the company
3. **Use PRs** for all changes (enforced by branch protection)
4. **Review** others' changes before approving merges

**For GitHub App / Automation:**
1. Private key stored in Azure Keyvault (not in code)
2. Token rotated automatically (GitHub App tokens expire)
3. App has minimal permissions (write to contents only)
4. Logs monitored for suspicious activity

---

## ✅ Final Go-Live Checklist

- [ ] All collaborators added and confirmed access
- [ ] Branch protection enabled on main
- [ ] GitHub App created and installed
- [ ] GitHub App private key stored securely in Keyvault
- [ ] IT has tested the full Azure → GitHub workflow
- [ ] Team has cloned the repo in VS Code
- [ ] VS Code Copilot is enabled for team
- [ ] First test meeting notes committed successfully
- [ ] Team can search and analyze with Copilot

---

## 📞 Support & Questions

**For Repository Issues:**
- Contact: Richard (Repository Owner)

**For Automation Issues:**
- Contact: IT Team / Cloud Ops

**For Access Issues:**
- Contact: Richard (can grant/revoke collaborator access)

---

**Last Updated:** March 27, 2026  
**Status:** Ready for Phase 2 (Access Control Setup)
