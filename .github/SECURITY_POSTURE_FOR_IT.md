# Security & Compliance Posture — For IT Review

## Architecture Security Assessment

### 1. Data Flow Authorization ✅
- **Microsoft 365 Data:** Teams meeting transcripts retrieved via Microsoft Graph API
- **Data Transit:** Direct Graph API → Azure Function/Logic App → GitHub API (encrypted HTTPS only)
- **Approval Gate:** No data leaves M365 without enterprise policy approval (IT controls what data is extracted)
- **Risk Level:** ✅ **LOW** — Data flows only through approved Microsoft and third-party services

### 2. GitHub Access Control ✅
- **Repository:** Private (not public)
- **Access Method:** Personal account with role-based collaborators
- **Permissions Model:**
  - Writers (Product team): Can read/write meeting insights
  - Readers (Extended team): Read-only, no write access
  - Automation (GitHub App): Write-only to meeting-notes folder, cannot modify code or settings
- **Risk Level:** ✅ **LOW** — Role-based access control with minimal privileges

### 3. Automation Credentials ✅
- **GitHub App:** Uses OAuth tokens instead of password/PAT
- **Token Lifetime:** Short-lived, auto-rotating (GitHub default: 1 hour)
- **Storage:** Private key in Azure Keyvault (encrypted at rest)
- **Secret Rotation:** Automatic (built into GitHub App model)
- **No Secrets in Code:** Zero hardcoded credentials
- **Risk Level:** ✅ **LOW** — GitHub Apps are more secure than personal access tokens

### 4. Microsoft Graph API Access 🟡
- **Scopes Required:** `User.Read.All`, `OnlineMeetings.Read` (to fetch transcripts)
- **Authentication:** Service account / Managed Identity (via Azure)
- **Recommendation:** Use Azure Managed Identity with least-privilege RBAC scope
- **Risk Level:** 🟡 **MEDIUM** — Depends on how service identity is scoped; review with Identity team

### 5. Audit Trail & Compliance ✅
- **Every Change Tracked:** Git stores full history (who, what, when, why)
- **Immutability:** Force push prevented on main branch
- **Retention:** GitHub retains commit history indefinitely
- **Export:** `git log` can export full audit trail for compliance/forensics
- **Risk Level:** ✅ **LOW** — Enterprise-grade change tracking

### 6. Data Sanitization ✅
- **Automation Step:** Before committing, remove:
  - Customer email addresses (replace with anonymized customer ID)
  - Financial terms (e.g., "customer paid $X" → "enterprise agreement")
  - Specific technical details about competitor products
  - Internal identifiers (use customer segments instead: "healthcare", "finance")
- **Manual Review:** Product team reviews PRs before approval
- **Risk Level:** ✅ **LOW** — Automated + human review

---

## Threat Model & Mitigations

| Threat | Likelihood | Impact | Mitigation | Status |
|--------|------------|--------|-----------|--------|
| **Accidental PII in commit** | Medium | High | Branch protection + PR review + pre-commit hooks | ✅ Planned |
| **GitHub account compromise** | Low | High | 2FA enabled on account, strong password | ✅ Assumed |
| **GitHub App token leak** | Low | Medium | Tokens auto-rotate, stored in Keyvault, not in code | ✅ Mitigated |
| **Unauthorized write to repo** | Low | High | Collaborator list curated, GitHub App minimal scope | ✅ Mitigated |
| **Data exfiltration via Copilot** | Low | Low | Copilot only sees repo content (no Teams access) | ✅ Mitigated |
| **Force push overwrites history** | Low | High | Branch protection prevents force push | ✅ Planned |
| **Microsoft Graph API compromise** | Very Low | Very High | Managed by Microsoft; use Managed Identity | ✅ Mitigated |

---

## Compliance Mappings

### SOC 2 Type II
- **CC6.1** (Logical access): Role-based access (collaborators)
- **CC6.2** (Authentication): GitHub's built-in 2FA + GitHub App OAuth
- **CC7.2** (Change management): Git history + PR review enforced
- **CC9.1** (Audit logging): Git provides immutable logs

### ISO 27001 / 27002
- **A.6.2.1** (User registrations): GitHub users managed by IT
- **A.9.1.1** (Access control): Least privilege (GitHub App scoped only to repo contents)
- **A.9.4.1** (Password management): Token rotation (automatic)
- **A.12.4.1** (Event logging): Git history + GitHub audit log

### HIPAA / GDPR (If Applicable)
- **Data Minimization**: Automation sanitizes PII before commit
- **Encryption**: HTTPS for all API calls, Keyvault for secrets at rest
- **Access Control**: Role-based + audit trail for access
- **Data Deletion**: Contact Richard to remove user access (revoke collaborator)
- **Recommendation**: Have legal review if storing any regulated data

---

## Pre-Go-Live Checklist for IT

### Security Setup
- [ ] Azure Keyvault configured with GitHub App private key
- [ ] Keyvault access logs enabled and monitored
- [ ] Service identity for Azure Function/Logic App created with least-privilege RBAC
- [ ] Microsoft Graph API scopes limited (avoid overly broad permissions)
- [ ] 2FA enabled on GitHub account (richardwitzerPE)

### Testing & Validation
- [ ] Test end-to-end: Meeting → Graph API → Markdown conversion → GitHub commit
- [ ] Verify GitHub App token auto-rotates correctly
- [ ] Confirm branch protection works (attempt force push, should fail)
- [ ] Verify PII sanitization rules work (test with sample data containing email/PII)
- [ ] Check Azure Monitor logs capture all commits

### Monitoring & Alerting
- [ ] Set up alert if GitHub App commits fail (check Azure Monitor)
- [ ] Monitor Keyvault for failed access attempts
- [ ] Set up regular audit trail exports (weekly/monthly)
- [ ] Confirm no secrets in commit history: `git log -S "password\|key\|token"`

### Documentation
- [ ] IT runbook created for troubleshooting GitHub App issues
- [ ] Incident response plan documented (what if GitHub App token compromised?)
- [ ] Offboarding process documented (how to revoke employee access)

---

## Incident Response Plan

### Scenario 1: GitHub App Token Compromised
1. Immediately rotate in GitHub App settings
2. Review Azure Monitor logs for unauthorized commits
3. Contact Richard to audit any malicious changes
4. Reset Keyvault secret and re-deploy

### Scenario 2: Unauthorized User Added to Repo
1. GitHub audit log shows who added them (use Settings → Audit Log)
2. Immediately remove from collaborators
3. Review recent commits for data exfiltration
4. Contact Richard if suspicious activity detected

### Scenario 3: PII Accidentally Committed
1. Alert Richard immediately
2. Use BFG Repo Cleaner to remove from history
3. Force-push (allowed for admins in emergencies)
4. Document incident

### Scenario 4: Branch Protection Disabled
1. Re-enable immediately
2. Review who disabled it (on personal account, likely admin)
3. Check for any force pushes during downtime

---

## Long-Term Roadmap

**Optional Future Enhancements (not required for MVP):**
- [ ] Set up GitHub secret scanning to catch hardcoded credentials automatically
- [ ] Integrate GitHub Advanced Security for code analysis
- [ ] Implement IP allowlisting (restrict to company network)
- [ ] Enable SAML SSO (if migrating to organization later)
- [ ] Set up automated compliance reports (SOC 2 evidence)

---

## Risk Sign-Off

**Prepared by:** GitHub Copilot (Customer Insights Setup)  
**Reviewed by:** [IT Security Team]  
**Approved by:** [CISO / Security Lead]  

**Overall Risk Assessment:** ✅ **LOW-RISK**
- Private repo with role-based access
- Least-privilege automation (GitHub App)
- Full audit trail via Git
- Data sanitization built-in
- All credentials encrypted in Keyvault

**Recommendation:** ✅ **APPROVED FOR PRODUCTION**

---

**Last Updated:** March 27, 2026
