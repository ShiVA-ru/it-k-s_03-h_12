export type CreatePostDto = {
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
}

export type UpdatePostDto = {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    blogId: string;
    blogName: string;
}