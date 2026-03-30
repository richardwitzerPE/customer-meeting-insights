#!/usr/bin/env node
// Parses one or more action-items.md files and POSTs each task to Power Automate.
// Usage: node post-action-items.js meetings/2026-03-27-natasha-brocks/action-items.md [...]

const fs = require('fs');
const https = require('https');
const path = require('path');
const url = require('url');

const WEBHOOK_URL = process.env.PA_WEBHOOK_URL;
if (!WEBHOOK_URL) {
  console.error('Error: PA_WEBHOOK_URL environment variable is not set.');
  process.exit(1);
}

const files = process.argv.slice(2);
if (files.length === 0) {
  console.log('No action-items.md files provided. Nothing to do.');
  process.exit(0);
}

function postTask(taskTitle, sourceFile, meetingFolder) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      title: taskTitle,
      sourceFile,
      meetingFolder,
    });

    const parsed = url.parse(WEBHOOK_URL);
    const options = {
      hostname: parsed.hostname,
      port: parsed.port || 443,
      path: parsed.path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve();
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const meetingFolder = path.basename(path.dirname(filePath));

  // Extract bullet lines that start with "- "
  const lines = content.split('\n');
  const tasks = lines
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))
    .map(l => l.replace(/^- /, '').trim())
    // Strip markdown bold markers if present
    .map(l => l.replace(/\*\*/g, ''))
    // Extract just the task title before "(Owner:" or "(Due:"
    .map(l => l.split(' (Owner:')[0].split(' (Due:')[0].trim())
    .filter(Boolean);

  console.log(`Found ${tasks.length} task(s) in ${filePath}`);

  for (const title of tasks) {
    console.log(`  → Posting: ${title}`);
    await postTask(title, filePath, meetingFolder);
    console.log(`    ✓ Done`);
  }
}

(async () => {
  for (const file of files) {
    await processFile(file);
  }
  console.log('All tasks posted successfully.');
})().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
