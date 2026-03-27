# Security & Access Guidelines

## 🔐 Data Classification

This repository contains **CONFIDENTIAL** customer information. 

**DO NOT commit:**
- Personally Identifiable Information (PII): names, email addresses, phone numbers, addresses
- Account identifiers: customer IDs if they are sensitive
- Financial information: pricing, payment terms (use anonymized examples instead)
- Authentication credentials: API keys, tokens, passwords
- Proprietary algorithms or source code
- Specific technical implementation details about other companies

**SAFE to commit:**
- Anonymized feedback: "From a hospitality customer" instead of "From customer X"
- Aggregated insights: "3 customers requested feature X"
- General themes and patterns
- Meeting outlines and summaries (without sensitive details)
- Product feedback and feature requests
- General market research and competitive intelligence

## 👥 Access Control

### Write Access Required For:
- Creating and editing meeting summaries and insights
- Updating aggregate information
- Modifying templates

### Read-Only Access For:
- Extended team members
- Viewing historical data
- Reference only

## 🛡️ Best Practices

1. **Before committing:** Review what you're about to push. Check for any sensitive data.
2. **Use anonymization:** Refer to "Customer in Healthcare vertical" instead of company names (if needed)
3. **Link, don't copy:** Reference meeting notes instead of copying large amounts of sensitive data
4. **Regular audits:** Periodically review files for accidental exposure
5. **Secure deletion:** If sensitive data is accidentally committed, contact repository maintainers immediately

## 🔄 Automated Processes

Files added via automated Teams integration are pre-screened to remove:
- Email addresses and contact information
- Specific customer names (replaced with customer IDs or categories)
- Financial terms and pricing details

## 🚨 Security Incident

If you accidentally commit sensitive information:

1. **Immediately notify** the repository owner or Product team lead
2. **Do not push** if you notice before uploading
3. **Use `git reset --soft HEAD~1`** to uncommit (before pushing)
4. **Contact GitHub Support** if data is already public

---

**Remember**: This is a private repository, but security depends on everyone following these guidelines.

Last Updated: March 2026
