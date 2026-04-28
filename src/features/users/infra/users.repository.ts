import {injectable} from "inversify";
import {type UserDocument, UserModel} from "../domain/user.entity.js";
import type {UserDb} from "../types/users.db.type.js";

@injectable()
export class UsersRepository {
    async save(user: UserDocument): Promise<string> {
        const result = await user.save();
        return result._id.toString();
    }

    async deleteOneById(id: string): Promise<boolean> {
        const deleteResult = await UserModel.deleteOne({
            _id: id,
        });

        return deleteResult.deletedCount >= 1;
    }

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDocument | null> {
        return UserModel.findOne({
            $or: [{email: loginOrEmail}, {login: loginOrEmail}],
        });
    }

    async isExistByLogin(login: string): Promise<boolean> {
        const result = await UserModel.exists({login});

        return result !== null;
    }

    async isExistByEmail(email: string): Promise<boolean> {
        const result = await UserModel.exists({email});

        return result !== null;
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return UserModel.findOne({email});
    }

    async findOneById(id: string): Promise<UserDocument | null> {
        return UserModel.findOne({_id: id});
    }

    async findOneByConfirmationCode(code: string): Promise<UserDocument | null> {
        return  UserModel.findOne({confirmationCode: code});
    }

    async findOneByPasswordRecoveryCode(
        code: string,
    ): Promise<UserDocument | null> {
        const user = await UserModel.findOne({recoveryCode: code});

        return user ?? null;
    }
}
