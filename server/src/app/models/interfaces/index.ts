import { Document, Model, HydratedDocument } from 'mongoose';

export type IModels = ICounterModel | IUserModel;

export interface ICounter extends Document {
	_id: string;
	seq: number;
}
export interface ICounterMethods {}
export interface ICounterModel extends Model<ICounter, {}, ICounterMethods> {
	getNextSequence(modelName: string, fieldName: string): Promise<number>;
	getNextSequence(model: IModels, fieldName: string): Promise<number>;
}
export type CounterHydratedDocument = HydratedDocument<
	ICounter,
	ICounterMethods
>;

export interface IUser extends Document {
	userId: number;
	username: string;
	password: string;
	email: string;

	fullName: string;
	gender: 0 | 1;
	address: string;
	phoneNumber: string;
	photo: string;
	proofId: string;

	roleId: number;
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
