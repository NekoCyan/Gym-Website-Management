import { Document, Model, HydratedDocument } from 'mongoose';
import { TokenPayload } from '@/Types';

export type IModels = ICounterModel | IUserModel;

// Counter.
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

// User.
export interface UserInformations {
	fullName: string;
	gender: -1 | 0 | 1;
	address: string;
	phoneNumber: string;
	photo: string;
	proofId: string;
}
export interface UserData {
	userId: number;
	username: string;
	password: string;
	email: string;

	roleId: number;
}
export interface IUser extends UserData, UserInformations, Document {}
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
	decodeAuthToken(token: string): Promise<TokenPayload>;
}
export type UserHydratedDocument = HydratedDocument<IUser, IUserMethods>;
