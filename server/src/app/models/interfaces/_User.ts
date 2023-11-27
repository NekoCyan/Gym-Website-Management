import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

import { GENDER, ROLES, TokenPayload } from '@/Types';

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