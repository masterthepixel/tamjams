# TamsJam Documentation Hub

Welcome to the TamsJam e-commerce platform documentation. This folder contains comprehensive guides for understanding, developing, and maintaining the project.

---

## 📚 Documentation Index

### Core Project Documentation

1. **[CLAUDE.md](../CLAUDE.md)** — Main developer guide
   - **Read this first** if you're new to the project
   - Architecture overview (frontend, backend, database)
   - Project setup instructions
   - Environment variables
   - Key patterns and best practices
   - Common troubleshooting

2. **[AGENTS.md](../AGENTS.md)** — AI agent specializations
   - Defines agent roles (Frontend, Backend, Product Data, DevOps)
   - Responsibilities and expertise areas for each role
   - Collaboration guidelines
   - Communication protocols
   - Escalation procedures

### Developer Guides (in DOCS/)

3. **[DEVELOPER_PERSONA.md](./DEVELOPER_PERSONA.md)** — How to think about this codebase
   - Developer mindset and philosophy
   - Communication style guide
   - Decision-making framework
   - Problem-solving approach
   - Success indicators
   - Best practices for long-term success

4. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** — Quick reference for common tasks
   - Local development setup
   - Product management (add, update)
   - Frontend development patterns
   - Backend development patterns
   - Database management
   - API testing commands
   - Debugging guides
   - Code patterns to follow
   - Performance optimization tips

### Session & Project History

5. **[SESSION_TRANSCRIPT_2026_03_04.md](./SESSION_TRANSCRIPT_2026_03_04.md)** — Complete session record
   - What was accomplished
   - Workflow and patterns learned
   - Technical decisions made
   - Errors encountered and solutions
   - Database schema information
   - Files modified/created
   - Lessons for future development

6. **[PRODUCT_IMPORT.md](./PRODUCT_IMPORT.md)** — Product import documentation
   - Details about the 7 jam products
   - Product data structure
   - Import workflow steps
   - Verification procedures

---

## 🚀 Quick Start Path

**New to TamsJam?** Follow this reading order:

1. Start with **CLAUDE.md** (10 min read)
   - Understand what the project is
   - Learn the architecture
   - Set up local development

2. Read **DEVELOPER_PERSONA.md** (10 min read)
   - Understand the development mindset
   - Learn the communication style
   - See how to approach problems

3. Reference **IMPLEMENTATION_GUIDE.md** (as needed)
   - Quick commands and patterns
   - Common task examples
   - Debugging checklist

4. Check **AGENTS.md** if specializing
   - Find your role
   - Understand responsibilities
   - Learn collaboration rules

---

## 📊 Project Status

| Component | Status | Location |
|-----------|--------|----------|
| Frontend Storefront | ✅ Running | `src/app/` and `src/modules/` |
| Backend API | ✅ Running | `backend/` |
| Product Data | ✅ Complete | `backend/DOCS/product-data.json` |
| Metadata Display | ✅ Working | `src/modules/products/templates/product-info/` |
| Collections | ✅ Linked | Products → "Jam" collection |
| Categories | ✅ Linked | Products → "Products" category |
| Multi-Region | ✅ Configured | Ready for international expansion |

---

## 🎯 Key Features Implemented

### Product Management
- ✅ 7 jam products imported with complete metadata
- ✅ Nutrition facts, ingredients, storage instructions
- ✅ Product descriptions and brand storytelling
- ✅ Collection and category organization

### Frontend Display
- ✅ Product detail pages with all metadata
- ✅ Safe JSON parsing for complex fields
- ✅ Responsive design with Tailwind CSS
- ✅ Multi-region routing support

### Backend Services
- ✅ Medusa V2 headless commerce
- ✅ Product seeding scripts
- ✅ Metadata management
- ✅ Collection and category linking

---

## 🔧 Common Tasks

### For New Developers
1. Read **CLAUDE.md** to understand architecture
2. Follow setup in **IMPLEMENTATION_GUIDE.md**
3. Run the dev servers
4. Explore the codebase

### For Adding Features
1. Check **AGENTS.md** for your role
2. Reference **IMPLEMENTATION_GUIDE.md** for patterns
3. Use **CLAUDE.md** for architecture questions
4. Follow code patterns in existing modules

### For Debugging
1. Consult troubleshooting section in **CLAUDE.md**
2. Check **IMPLEMENTATION_GUIDE.md** debugging guide
3. Review **SESSION_TRANSCRIPT_2026_03_04.md** for solutions to known issues
4. Use provided curl commands to test API

### For Product Management
1. Reference **PRODUCT_IMPORT.md** for data structure
2. Use scripts in **IMPLEMENTATION_GUIDE.md**
3. Edit `backend/DOCS/product-data.json`
4. Run `pnpm update:metadata` to sync changes

---

## 📁 File Organization

```
TamsJam/
├── CLAUDE.md                    # ← START HERE (Main guide)
├── AGENTS.md                    # Agent roles & collaboration
├── DOCS/
│   ├── README.md               # This file
│   ├── DEVELOPER_PERSONA.md    # Developer mindset guide
│   ├── IMPLEMENTATION_GUIDE.md # Quick reference & patterns
│   ├── SESSION_TRANSCRIPT...   # Session record & learnings
│   ├── PRODUCT_IMPORT.md       # Product data documentation
│   └── [other docs...]
├── src/                         # Frontend (Next.js)
│   ├── app/[countryCode]/      # Multi-region routing
│   ├── modules/                # Feature modules
│   ├── lib/                    # Data fetching & utilities
│   └── ...
├── backend/                     # Backend (Medusa)
│   ├── src/
│   │   ├── scripts/            # Seed & migration scripts
│   │   ├── modules/            # Custom modules (if any)
│   │   ├── links/              # Module relationships
│   │   └── ...
│   ├── DOCS/
│   │   └── product-data.json   # Product seed data
│   ├── medusa-config.ts        # Framework configuration
│   └── ...
├── docker-compose.yml          # PostgreSQL setup
├── .env.local                  # Frontend env vars
├── backend/.env                # Backend env vars
└── ...
```

---

## 🔗 External Resources

### Official Documentation
- **Medusa V2 Docs**: https://docs.medusajs.com/
- **Next.js Docs**: https://nextjs.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs

### Tools & Services
- **Medusa Admin**: http://localhost:7001 (when deployed)
- **PostgreSQL**: `psql postgresql://user:pass@localhost:5432/medusa`
- **Stripe Documentation**: https://stripe.com/docs

---

## 📝 Documentation Standards

When adding new documentation:

1. **Use clear headings** — Start with `#`, use `##` for sections, `###` for subsections
2. **Include examples** — Show code snippets and command examples
3. **Provide context** — Explain the why, not just the what
4. **Link to related docs** — Help readers navigate the documentation
5. **Keep it current** — Update when processes change
6. **Use status indicators** — ✅ ❌ ⚠️ to show project status

---

## 🤝 Contributing to Documentation

### When to Update Docs
- When implementing new patterns
- When fixing recurring issues
- When changing architecture
- When creating new processes
- When learning something valuable

### What to Update
1. **CLAUDE.md** — If architecture or patterns change
2. **AGENTS.md** — If roles or responsibilities change
3. **IMPLEMENTATION_GUIDE.md** — If processes or commands change
4. **SESSION_TRANSCRIPT...** — Keep for historical record, don't update
5. **DEVELOPER_PERSONA.md** — If team culture or mindset changes

### Quality Checklist
- [ ] Clear, concise language
- [ ] Accurate information (tested)
- [ ] Proper formatting and structure
- [ ] Examples and code snippets
- [ ] Links to related documentation
- [ ] Updated date if significant changes

---

## 🎓 Learning Path

### Week 1: Understanding
- Read CLAUDE.md
- Read DEVELOPER_PERSONA.md
- Explore the codebase structure
- Set up local development

### Week 2: Hands-On
- Add a new product using IMPLEMENTATION_GUIDE.md
- Modify a frontend component
- Test API endpoints with curl

### Week 3: Contribution
- Implement a small feature
- Follow code patterns in existing modules
- Document your work

### Week 4+: Mastery
- Build new features with confidence
- Help other developers
- Improve documentation
- Optimize performance

---

## ❓ FAQ

**Q: Where do I start?**
A: Read CLAUDE.md first, then DEVELOPER_PERSONA.md

**Q: How do I add a product?**
A: See IMPLEMENTATION_GUIDE.md → Product Management section

**Q: How do I debug an issue?**
A: Check CLAUDE.md troubleshooting, then IMPLEMENTATION_GUIDE.md debugging guide

**Q: What patterns should I follow?**
A: See IMPLEMENTATION_GUIDE.md → Code Patterns section

**Q: Who should I ask for help?**
A: Check AGENTS.md for role-specific contacts or escalation path

**Q: How is the project structured?**
A: See CLAUDE.md → Architecture sections

**Q: What's been done already?**
A: Read SESSION_TRANSCRIPT_2026_03_04.md

---

## 📞 Support & Escalation

### For Quick Questions
1. Check CLAUDE.md's troubleshooting section
2. Look up in IMPLEMENTATION_GUIDE.md
3. Search SESSION_TRANSCRIPT for similar issues

### For Feature Requests
1. Document the request clearly
2. Check AGENTS.md for relevant agent
3. Discuss with team

### For Bug Reports
1. Reproduce the issue
2. Document steps to reproduce
3. Check if it's documented in CLAUDE.md
4. File issue with context

---

## 🔒 Security & Best Practices

- Never commit `.env` files (they're in `.gitignore`)
- Never commit database credentials
- Always use `+metadata` field selector for safety
- Validate user input on the backend
- Use TypeScript for type safety
- Test changes locally before committing

---

## 📈 Project Metrics

- **Lines of Code**: ~8000+ (frontend) + ~5000+ (backend)
- **Components**: 20+ feature modules
- **Products**: 7 jam products (fully featured)
- **Coverage**: End-to-end product import workflow
- **Documentation**: 2000+ lines across guides

---

## ✨ Last Updated

- **Date**: March 4, 2026
- **Last Session**: Product import & Medusa patterns learning
- **Status**: ✅ Production-ready core features
- **Next Phase**: Admin dashboard, payment processing, inventory management

---

**Questions?** Check the relevant documentation file or consult SESSION_TRANSCRIPT_2026_03_04.md for similar scenarios.

**Ready to contribute?** Start with CLAUDE.md and follow the learning path above.

**Let's build something great!** 🚀
