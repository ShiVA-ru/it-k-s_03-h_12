import type { Request, Response } from "express";
import { matchedData } from "express-validator";
import { inject, injectable } from "inversify";
import type {
	validationErrorsDto,
	validationErrorType,
} from "../../../core/types/errors.types.js";
import { HttpStatus } from "../../../core/types/http-statuses.types.js";
import type { Paginator } from "../../../core/types/paginator.type.js";
import type {
	RequestWithBody,
	RequestWithParams,
	RequestWithParamsAndBody,
} from "../../../core/types/request.types.js";
import type { URIParamsId } from "../../../core/types/uri-params.type.js";
import { PostsService } from "../../posts/application/posts.service.js";
import { PostsQueryRepository } from "../../posts/infra/posts.query.repository.js";
import type { BlogPostInput } from "../../posts/types/blogs-posts.input.type.js";
import type { PostsQueryInput } from "../../posts/types/posts.query.type.js";
import type { PostView } from "../../posts/types/posts.view.type.js";
import { BlogsService } from "../application/blogs.service.js";
import { BlogsQueryRepository } from "../infra/blogs.query.repository.js";
import type { BlogInput } from "../types/blogs.input.type.js";
import type { BlogsQueryInput } from "../types/blogs.query.type.js";
import type { BlogView } from "../types/blogs.view.type.js";

@injectable()
export class BlogsController {
	constructor(
		@inject(PostsQueryRepository)
		protected postsQueryRepository: PostsQueryRepository,
		@inject(BlogsQueryRepository)
		protected blogsQueryRepository: BlogsQueryRepository,
		@inject(PostsService)
		protected postsService: PostsService,
		@inject(BlogsService)
		protected blogsService: BlogsService,
	) {}

	async getBlog(
		req: RequestWithParams<URIParamsId>,
		res: Response<BlogView | validationErrorsDto>,
	) {
		try {
			const findEntity = await this.blogsQueryRepository.findOneById(
				req.params.id,
			);

			if (!findEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Ok).json(findEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.NotFound);
		}
	}

	async getBlogs(req: Request, res: Response<Paginator<BlogView>>) {
		try {
			const queryData = matchedData<BlogsQueryInput>(req, {
				locations: ["query"],
			});

			const blogsListOutput =
				await this.blogsQueryRepository.findAll(queryData);

			res.status(HttpStatus.Ok).json(blogsListOutput);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async getBlogsPosts(req: Request, res: Response<Paginator<PostView>>) {
		try {
			const blogId = req.params.id.toString();
			const blog = await this.blogsQueryRepository.findOneById(blogId);

			if (!blog) {
				return res.sendStatus(HttpStatus.NotFound);
			}
			const queryData = matchedData<PostsQueryInput>(req, {
				locations: ["query"],
			});

			const postsListOutput = await this.postsQueryRepository.findByBlogId(
				blogId,
				queryData,
			);

			if (!postsListOutput) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Ok).json(postsListOutput);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async createBlog(
		req: RequestWithBody<BlogInput>,
		res: Response<BlogView | validationErrorType>,
	) {
		try {
			const insertedId = await this.blogsService.create(req.body);

			const createdEntity =
				await this.blogsQueryRepository.findOneById(insertedId);

			if (!createdEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Created).json(createdEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async createBlogPost(
		req: RequestWithParamsAndBody<URIParamsId, BlogPostInput>,
		res: Response<PostView | validationErrorsDto>,
	) {
		try {
			const blogId = req.params.id;
			const insertedId = await this.postsService.create({
				blogId,
				title: req.body.title,
				shortDescription: req.body.shortDescription,
				content: req.body.content,
			});

			if (!insertedId) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			const createdEntity =
				await this.postsQueryRepository.findOneById(insertedId);

			if (!createdEntity) {
				return res.sendStatus(HttpStatus.NotFound);
			}

			res.status(HttpStatus.Created).json(createdEntity);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.InternalServerError);
		}
	}

	async updateBlog(
		req: RequestWithParamsAndBody<URIParamsId, BlogInput>,
		res: Response<BlogView | validationErrorsDto>,
	) {
		try {
			const isUpdated = await this.blogsService.updateById(
				req.params.id,
				req.body,
			);

			if (!isUpdated) {
				res.sendStatus(HttpStatus.NotFound);
				return;
			}

			res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.NotFound);
		}
	}

	async deleteBlog(req: RequestWithParams<URIParamsId>, res: Response) {
		try {
			const isDeleted = await this.blogsService.deleteOneById(req.params.id);

			if (!isDeleted) {
				res.sendStatus(HttpStatus.NotFound);
				return;
			}

			return res.sendStatus(HttpStatus.NoContent);
		} catch (error) {
			console.error(error);
			res.sendStatus(HttpStatus.NotFound);
		}
	}
}
