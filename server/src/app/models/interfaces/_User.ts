import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';

import { TokenPayload } from '@/Types';

export interface UserDetails {
	fullName: string;
	gender: number;
	address: string;
	phoneNumber: string;
	photo: string;
}
export interface UserData {
	userId: number;
	email: string;
	password: string;

	role: number;

	balance: number;
	totalBalance: number;
}

export interface IUser
	extends UserData,
		UserDetails,
		DocumentResult<UserDetails & UserData>,
		Document {}
export interface IUserMethods {
	comparePassword(password: string): Promise<boolean>;
	/**
	 * @param expiresIn seconds.
	 */
	generateAuthToken(expiresIn?: number): Promise<string>;
	update(
		data: Partial<UserData & UserDetails>,
		extraData?: { [key: string]: any },
	): Promise<UserHydratedDocument>;
	increaseBalance(
		amount: number,
	): Promise<Pick<UserData, 'balance' | 'totalBalance'>>;
	decreaseBalance(
		amount: number,
	): Promise<Pick<UserData, 'balance' | 'totalBalance'>>;
}
export interface IUserModel extends Model<IUser, {}, IUserMethods> {
	getUser(userId: number): Promise<UserHydratedDocument>;
	findByCredentials(
		username: string,
		password: string,
	): Promise<UserHydratedDocument>;
	findByAuthToken(token: string): Promise<UserHydratedDocument>;
	decodeAuthToken(token: string): Promise<TokenPayload>;
	extractUserDetails(
		data: Partial<UserDetails>,
	): Promise<Partial<UserDetails>>;
	extractUserData(
		data: Partial<Omit<UserData, 'userId'>>,
	): Promise<Partial<Omit<UserData, 'userId'>>>;
	updateUser(
		userId: number,
		data: Partial<UserData & UserDetails>,
		extraData?: { [key: string]: any },
	): ReturnType<IUserMethods['update']>;
	updateBalance(
		userId: number,
		amount: number,
	): Promise<Pick<UserData, 'balance' | 'totalBalance'>>;
	getUserList(
		limit?: number,
		page?: number,
	): Promise<DocumentList<Omit<UserData & UserDetails, 'password'>>>;
}
export type UserHydratedDocument = HydratedDocument<IUser, IUserMethods>;
