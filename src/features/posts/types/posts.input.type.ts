import type { PostView } from "./posts.view.type.js";

export type PostInput = Omit<PostView, "id" | "blogName" | "createdAt">;
