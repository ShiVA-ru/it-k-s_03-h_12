import "reflect-metadata";
import { Container } from "inversify";
import { RegistrationService } from "./features/auth/application/auth.registration.service.js";
import { AuthService } from "./features/auth/application/auth.service.js";
import { AuthController } from "./features/auth/routers/auth.controller.js";
import { BlogsService } from "./features/blogs/application/blogs.service.js";
import { BlogsQueryRepository } from "./features/blogs/repositories/blogs.query.repository.js";
import { BlogsRepository } from "./features/blogs/repositories/blogs.repository.js";
import { BlogsController } from "./features/blogs/routers/blogs.controller.js";
import { CommentsService } from "./features/comments/application/comments.service.js";
import { CommentsQueryRepository } from "./features/comments/repositories/comments.query.repository.js";
import { CommentsRepository } from "./features/comments/repositories/comments.repository.js";
import { CommentsController } from "./features/comments/routers/comments.controller.js";
import { DevicesService } from "./features/devices/application/devices.service.js";
import { DevicesQueryRepository } from "./features/devices/repositories/devices.query.repository.js";
import { DevicesRepository } from "./features/devices/repositories/devices.repository.js";
import { DevicesController } from "./features/devices/routers/devices.controller.js";
import { PostsService } from "./features/posts/application/posts.service.js";
import { PostsQueryRepository } from "./features/posts/repositories/posts.query.repository.js";
import { PostsRepository } from "./features/posts/repositories/posts.repository.js";
import { PostsController } from "./features/posts/routers/posts.controller.js";
import { UsersService } from "./features/users/application/users.service.js";
import { UsersQueryRepository } from "./features/users/repositories/users.query.repository.js";
import { UsersRepository } from "./features/users/repositories/users.repository.js";
import { UsersController } from "./features/users/routers/users.controller.js";
import {EmailAdapter} from "./adapters/email.adapter.js";
import {BcryptService} from "./features/auth/application/bcrypt.service.js";
import {JwtService} from "./features/auth/application/jwt.service.js";

export const container: Container = new Container();

container.bind(EmailAdapter).toSelf();
container.bind(BcryptService).toSelf();
container.bind(JwtService).toSelf();

container.bind(CommentsRepository).toSelf();
container.bind(CommentsQueryRepository).toSelf();

container.bind(PostsRepository).toSelf();
container.bind(PostsQueryRepository).toSelf();

container.bind(BlogsRepository).toSelf();
container.bind(BlogsQueryRepository).toSelf();

container.bind(UsersRepository).toSelf();
container.bind(UsersQueryRepository).toSelf();

container.bind(DevicesRepository).toSelf();
container.bind(DevicesQueryRepository).toSelf();

container.bind(CommentsService).toSelf();
container.bind(PostsService).toSelf();
container.bind(BlogsService).toSelf();
container.bind(DevicesService).toSelf();
container.bind(UsersService).toSelf();
container.bind(AuthService).toSelf();
container.bind(RegistrationService).toSelf();

container.bind(CommentsController).toSelf();
container.bind(PostsController).toSelf();
container.bind(BlogsController).toSelf();
container.bind(DevicesController).toSelf();
container.bind(UsersController).toSelf();
container.bind(AuthController).toSelf();
