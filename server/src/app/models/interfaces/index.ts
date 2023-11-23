import { Document, Model, HydratedDocument } from 'mongoose';

export interface IUser extends Document {
	username: string;
	password: string;
	email: string;

	fullName: string;
	address: string;
	phoneNumber: string;

	role: 0 | 1;
}
export interface IUserMethods {
	comparePassword(password: string): Promise<boolean>;
	/**
	 * @param expiresIn seconds.
	 */
	generateAuthToken(expiresIn?: number): Promise<string>;
}
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
	findByCredentials(
		username: string,
		password: string,
	): Promise<UserHydratedDocument>;
	findByAuthToken(token: string): Promise<UserHydratedDocument>;
}
export type UserHydratedDocument = HydratedDocument<IUser, IUserMethods>;
