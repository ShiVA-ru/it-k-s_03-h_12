import type { BlogView } from "./blogs.view.type.js";

export type BlogInput = Omit<BlogView, "id" | "createdAt" | "isMembership">;
