import Anthropic from '@anthropic-ai/sdk';
import { execSync } from 'child_process';
import { logContent, getNextTopic } from './database.js';

const client = new Anthropic();

export async function generateSEOArticle() {
  const topic = await getNextTopic();

  const topics = {
    'how_to_calculate_ai_agent_roi': 'How to Calculate ROI for Your AI Agents',
    'enterprise_llm_cost_management': 'Enterprise LLM Cost Management Guide',
    'ai_agent_spending_tracking': 'AI Agent Spending Tracking Best Practices',
    'openai_api_cost_attribution': 'OpenAI API Cost Attribution for Enterprises',
    'profitable_ai_agents': 'How to Know If Your AI Agents Are Profitable',
    'ai_agent_budget_management': 'AI Agent Budget Management',
    'llm_cost_per_task': 'LLM Cost Per Task Calculation',
    'enterprise_ai_visibility': 'Enterprise AI Spending Visibility',
    'ai_agent_financial_reporting': 'AI Agent Financial Reporting',
    'measuring_automation_roi': 'Measuring AI Automation ROI',
    'cost_optimisation_strategies': 'AI Agent Cost Optimisation Strategies',
    'cfo_guide_ai_spending': 'CFO Guide to AI Agent Spending',
    'ai_agent_governance': 'AI Agent Governance and Cost Control',
  };

  const title = topics[topic];

  const prompt = `Write a compelling 1,200-word article about "${title}".

Include:
- Compelling headline
- Engaging introduction (2-3 sentences)
- 4-5 sections with subheadings
- Real data points and examples
- Conclusion with CTA to try AgentCFO

Format as HTML. Include these CTA elements:
<p>Ready to optimize your AI agent spending? <a href="https://agent-cfo-six.vercel.app">Try AgentCFO free</a> — 15 minutes to financial visibility.</p>

Return ONLY the HTML content, no markdown or extra text.`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const htmlContent = message.content[0].text;
  const slug = topic.replace(/_/g, '-');
  const filename = `frontend/public/blog/${slug}.html`;

  // Write file
  await new Promise((resolve, reject) => {
    const fs = require('fs');
    fs.writeFile(filename, `
<!DOCTYPE html>
<html>
<head>
  <title>${title} | AgentCFO</title>
  <meta name="description" content="Learn about ${title.toLowerCase()} with AgentCFO's expert guide.">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="Learn about ${title.toLowerCase()} with AgentCFO.">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #C8F264; }
    a { color: #C8F264; }
  </style>
</head>
<body>
  <a href="/">← Back to AgentCFO</a>
  ${htmlContent}
</body>
</html>
    `, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Commit and push
  execSync(`git add ${filename}`);
  execSync(`git commit -m "content: publish SEO article - ${title}"`);
  execSync(`git push https://hridhaygarg:${process.env.GITHUB_TOKEN}@github.com/hridhaygarg/AgentCFO.git main`);

  // Log to database
  await logContent({
    topic,
    title,
    slug,
    publishDate: new Date(),
    url: `https://agent-cfo-six.vercel.app/blog/${slug}.html`,
  });

  console.log(`✅ Published: ${title}`);
}
