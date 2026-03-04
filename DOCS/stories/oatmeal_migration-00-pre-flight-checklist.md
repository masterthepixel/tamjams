# Story 00: Pre-Flight Checklist & Rollback Strategy

**Goal:** Establish a safety net, test coverage baseline, and a secure rollback plan before mutating the styling engine and UI components.

## Tasks

1. **Document Versions:** Note the current versions of Next.js, Tailwind v3, and Medusa UI components to ensure a clear baseline before upgrading.
2. **Create Test Checklist:** Draft a list of critical user flows that must be tested before and after major styling changes. At a minimum, include:
   - Add to cart
   - Full checkout process (shipping, payment, review)
   - User login and account management
3. **Establish Branch Strategy:** Create a dedicated integration branch for the epic (e.g., `epic/oatmeal-redesign`). All subsequent story branches should target this branch, keeping `main` perfectly safe and making rollback as simple as abandoning the branch.
4. **Audit Reference Repo:** Review `reference/oatmeal-olive-instrument/` for purely demo-driven or mock-data code so developers know what to exclude when copying in Story 04.

## Acceptance Criteria

* Current dependency versions and critical path test checklist are explicitly documented.
* The `epic/oatmeal-redesign` branch is created and pushed.
* Rollback strategy is confirmed (e.g., "Abandon branch if Tailwind v4 proves catastrophically incompatible").

---

This story mitigates the risk of starting a massive UI overhaul without a fallback plan.