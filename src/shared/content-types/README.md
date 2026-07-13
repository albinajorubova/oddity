Content types (CMS/MD) and validators

- Place content schemas here for CMS-driven content (e.g., blog posts, pages, metadata) or local MD/MDX frontmatter.
- Prefer runtime validation alongside TypeScript types, e.g., with Zod.
- Expose only validated DTOs to features/entities.

Recommended structure:
- schemas/ — zod schemas
- dto/ — TypeScript types inferred from schemas
- mappers/ — mapping from raw CMS response to DTO
