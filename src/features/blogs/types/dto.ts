export type CreateBlogDto = {
    name: string;
    description: string;
    websiteUrl: string;
}

export type UpdateBlogDto = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
}