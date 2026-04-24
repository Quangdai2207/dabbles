# Agent Rules & Instructions

> **IMPORTANT**: AI MUST read this file at the START of EVERY new conversation before doing any work.

## 🎯 Core Principles

1. **Work Directly**: Tự phân tích và chỉnh sửa mã nguồn mà không cần giải thích rườm rà
2. **No Summaries**: Không tóm tắt sau khi hoàn thành, chỉ báo kết quả
3. **Check Context First**: Luôn đọc AGENTS.md và @.agent trước khi làm việc
4. **Follow Workflows**: Nếu có workflow trong @.agent/workflows, follow đúng quy trình

## 📋 Workflow Tự Động

### Khi bắt đầu conversation mới:

1. ✅ Đọc `AGENTS.md` (file này) - Project rules & context
2. ✅ Check `@.agent/workflows` cho tasks liên quan
3. ✅ Use `~/.gemini/antigravity/knowledge/` cho general knowledge (Next.js docs, MCP usage, etc.)
4. ✅ Đọc project files khi cần (code, configs, etc.)
5. ✅ Bắt đầu làm việc trực tiếp

### Knowledge Base vs Project Files

**`~/.gemini/antigravity/knowledge/`** (General knowledge)

- ✅ Next.js 16 features từ docs
- ✅ MCP usage guides
- ✅ TypeScript/React/Flutter best practices
- ✅ Debugging techniques
- ✅ Design patterns
- ❌ KHÔNG lưu project-specific info

**`dabble-project/`** (Project-specific)

- ✅ AGENTS.md (this file) - Project rules
- ✅ Source code
- ✅ Configs
- ✅ Project documentation (nếu có)
- ✅ .agent/workflows/

### Khi nhận task:

1. Phân tích requirements
2. Check knowledge base cho general knowledge
3. Check existing code/docs trong project
4. Implement changes
5. Verify results
6. Report concisely

## 🛠️ Project Context

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL + Prisma
- **Styling**: Tailwind CSS
- **Mobile**: Flutter (Dart)

### Coding Standards

- TypeScript strict mode enabled
- ESLint + Prettier configured
- Conventional commits
- Component-based architecture
- Clean code principles

### File Structure

```
dabble-project/
├── .agent/           # Agent workflows & skills
├── mobile/           # Flutter app
├── client/           # Next.js web app
└── AGENTS.md         # This file
```

## 🔧 Common Tasks

### Code Analysis

- Tự động phân tích code trước khi edit
- Identify patterns và best practices
- Suggest improvements khi thấy issues

### Bug Fixing

- Đọc error messages carefully
- Check related files
- Fix root cause, not symptoms
- Verify fix works

### Feature Implementation

- Understand requirements fully
- Plan architecture if complex
- Implement incrementally
- Test thoroughly

## 🚫 What NOT to Do

- ❌ Giải thích dài dòng về những gì đã làm
- ❌ Hỏi xác nhận cho mọi thay đổi nhỏ
- ❌ Tóm tắt lại sau khi hoàn thành
- ❌ Ignore existing patterns trong codebase

## ✅ What TO Do

- ✅ Làm việc trực tiếp và tự tin
- ✅ Follow existing code patterns
- ✅ Báo cáo ngắn gọn kết quả
- ✅ Suggest improvements khi thấy cơ hội

## 📚 Resources

- Skills: Check `.agent/skills/` for specialized capabilities
- Workflows: Check `.agent/workflows/` for step-by-step guides
- Docs: Refer to official Next.js, Flutter docs when needed

## 🔌 MCP Servers Usage Guide

### Available MCP Servers

1. **fetch** - HTTP GET requests, scrape web content
2. **brave-search** - Web search với descriptions
3. **duckduckgo-search** - Web search (avoid - rate limit thấp)
4. **perplexity** - AI-powered search/reasoning/research
5. **context7** - Code examples từ docs (10,222 snippets!)
6. **next-devtools** - Next.js official docs và runtime tools
7. **github** - GitHub API (repos, issues, PRs)
8. **dart-mcp-server** - Flutter/Dart development tools
9. **shadcn** - shadcn/ui components
10. **filesystem** - File operations (đã có sẵn)
11. **memory** - Temporary session storage (KHÔNG persistent!)
12. **sequential-thinking** - Structured reasoning cho vấn đề phức tạp

### Decision Tree: Khi nào dùng MCP nào?

```
Task: Cần thông tin?
├─ Biết URL cụ thể?
│  ├─ YES → fetch (full content)
│  └─ NO → brave-search (tìm URLs) → fetch (đọc content)
│
├─ Cần Next.js docs?
│  ├─ Official docs → next-devtools (best)
│  ├─ Code examples → context7 (/vercel/next.js)
│  └─ Latest news → perplexity search
│
├─ Cần code examples?
│  ├─ Next.js → context7 (/vercel/next.js) hoặc next-devtools
│  ├─ React → context7 (/facebook/react)
│  └─ Other libs → context7 (resolve-library-id first)
│
├─ Research phức tạp?
│  ├─ Quick answer → perplexity search
│  ├─ Analysis → perplexity reason
│  └─ Deep research → perplexity deep_research
│
├─ Vấn đề phức tạp cần tư duy?
│  └─ sequential-thinking (planning, debugging, architecture)
│
└─ GitHub operations?
   └─ github MCP (create issues, PRs, etc.)
```

### Workflow Examples

#### 1. Research Next.js Feature

```markdown
Step 1: Search for URLs
→ brave-search("Next.js 16 Cache Components")

Step 2: Get full docs
→ fetch(https://nextjs.org/docs/app/getting-started/cache-components)

Step 3: Get code examples
→ context7 query-docs(/vercel/next.js/v16.1.1, "use cache examples")

Step 4: Verify understanding
→ next-devtools (if dev server running)
```

#### 2. Debug Complex Issue

```markdown
Step 1: Structure thinking
→ sequential-thinking (phân tích vấn đề từng bước)

Step 2: Research solutions
→ perplexity reason("Next.js hydration error causes and solutions")

Step 3: Get code examples
→ context7 query-docs(/vercel/next.js, "hydration error fix")

Step 4: Implement fix
→ Edit files directly
```

#### 3. Learn New Library

```markdown
Step 1: Find library ID
→ context7 resolve-library-id("prisma", "Prisma ORM usage")

Step 2: Get documentation
→ context7 query-docs(/prisma/prisma, "how to define schema and relations")

Step 3: Search for examples
→ brave-search("Prisma Next.js example")

Step 4: Read full tutorial
→ fetch(URL from search)
```

### MCP Best Practices

#### ✅ DO

- **Combine MCPs**: Search → fetch → context7 (workflow)
- **Use context7 for code**: 10,222 snippets > web search
- **Use next-devtools for Next.js**: Official docs, always up-to-date
- **Use perplexity for complex questions**: Better than simple search
- **Use sequential-thinking for planning**: Structured approach
- **Cache results**: Lưu vào artifacts, không query lại

#### ❌ DON'T

- **Don't use duckduckgo**: Rate limit quá thấp
- **Don't use memory MCP**: Không persistent, data mất
- **Don't fetch without URL**: Phải search trước
- **Don't skip context7**: Code examples tốt nhất
- **Don't use perplexity cho simple queries**: Waste credits

### Common Patterns

#### Pattern 1: Documentation Lookup

```
1. next-devtools (if Next.js) hoặc context7 (other libs)
2. Nếu không tìm thấy → brave-search
3. fetch URL để đọc full content
```

#### Pattern 2: Problem Solving

```
1. sequential-thinking (break down problem)
2. perplexity reason (research solutions)
3. context7 (get code examples)
4. Implement solution
```

#### Pattern 3: Learning New Tech

```
1. brave-search (find official docs)
2. fetch (read overview)
3. context7 (code examples)
4. perplexity (deep dive specific topics)
```

### MCP Limitations

| MCP          | Limitation       | Workaround                    |
| ------------ | ---------------- | ----------------------------- |
| fetch        | Chỉ GET          | Dùng curl commands            |
| brave-search | Summary only     | Combine với fetch             |
| duckduckgo   | Rate limit       | Dùng brave-search             |
| memory       | Không persistent | Dùng artifacts                |
| context7     | Cần library ID   | resolve-library-id first      |
| perplexity   | API credits      | Dùng cho complex queries only |

### Quick Reference

```bash
# Documentation
Next.js → next-devtools hoặc context7 (/vercel/next.js)
React → context7 (/facebook/react)
Other → context7 resolve-library-id → query-docs

# Search
Quick → brave-search
Complex → perplexity (search/reason/deep_research)

# Content
Full page → fetch (need URL)
Code examples → context7

# Reasoning
Complex problem → sequential-thinking
Research → perplexity

# Development
Flutter → dart-mcp-server
GitHub → github MCP
UI components → shadcn
```

---

**Last Updated**: 2026-01-17
**Version**: 1.1.0 (Added MCP guide)
