import { Document, Model, HydratedDocument } from 'mongoose';
import { GENDER, ROLES, TokenPayload } from '@/Types';

// External Document.
interface DocumentResult<T> {
	_doc: T;
}

export type IModels = ICounterModel | IUserModel;

// Counter.
export interface CounterData {
	_id: string;
	seq: number;
}
export interface ICounter extends CounterData, Document {
	_id: string;
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
	gender: GENDER;
	address: string;
	phoneNumber: string;
	photo: string;
}
export interface UserData {
	userId: number;
	email: string;
	password: string;

	role: ROLES;
}
export interface IUser
	extends UserData,
		UserInformations,
		DocumentResult<UserInformations & UserData>,
		Document {}
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
	extractUserInformations(
		data: Partial<UserInformations>,
	): Promise<Partial<UserInformations>>;
	extractUserData(data: Partial<UserData>): Promise<Partial<UserData>>;
	updateUser(
		userId: number,
		data: Partial<UserInformations & Pick<UserData, 'password'>>,
		extraData?: { [key: string]: any },
	): Promise<UserHydratedDocument>;
}
export type UserHydratedDocument = HydratedDocument<IUser, IUserMethods>;
