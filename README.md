# Customer Meeting Insights

A private repository for storing and organizing customer meeting transcripts, summaries, and strategic insights. This repository is designed to be easily searchable and usable in VS Code with GitHub Copilot.

## 📋 Repository Structure

```
customer-meeting-insights/
├── meeting-notes/          # Raw transcripts and recordings notes
├── summaries/              # Executive summaries of meetings
├── insights/               # Analysis and findings organized by topic
│   ├── product-feedback.md
│   ├── feature-requests.md
│   ├── customer-painpoints.md
│   ├── competitive-intelligence.md
│   └── implementation-notes.md
└── templates/              # Templates for consistency
```

### Folder Descriptions

- **meeting-notes/**: Store raw meeting transcripts, timestamps, and attendee lists. Organized by date or customer name.
- **summaries/**: Executive summaries of key meetings. One file per meeting for quick reference.
- **insights/**: Strategic analysis organized by topic. These are living documents that aggregate insights across multiple meetings.
- **templates/**: Reusable templates to ensure consistency across all documents.

## 🔐 Access Control

This is a **private repository**. Access is restricted to authorized team members:

- **Write Access** (can create, edit, and push): Product team leads
- **Read-Only Access** (can pull and read): Extended team members
- **Automated Updates**: Service identity for Teams-to-GitHub sync

**Never commit:**
- Customer PII or sensitive data (account numbers, credit cards, etc.)
- API keys or credentials
- Proprietary algorithms or source code

## 📝 How to Use

1. **After a customer meeting:**
   - Add raw notes to `meeting-notes/` with the date and customer name
   - Create a summary in `summaries/`

2. **When analyzing patterns:**
   - Add findings to the relevant file in `insights/`
   - Link to related meeting notes for reference

3. **Searching for insights:**
   - Use GitHub search or VS Code Copilot to find customer feedback across all documents
   - Copilot can help synthesize insights from multiple meetings

## 🤖 Using with GitHub Copilot in VS Code

This repository is optimized for Copilot:

- Clone it to VS Code and open the folder
- Use Copilot to search for patterns: "What are common product feedback themes?"
- Ask Copilot to summarize: "Create a summary of all feature requests from Q1"
- Request analysis: "What are our top customer pain points?"

## 🔄 Automated Updates

Customer meeting transcripts from Teams meetings are automatically synced to this repository via a secure service identity. Files are added to `meeting-notes/` on a scheduled basis.

## 📧 Feedback & Questions

For questions about this repository structure or access, contact the Product team.

---

**Last Updated**: March 2026
**Private Repository** - Do not share access links
