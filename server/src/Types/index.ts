import { JWTPayload } from 'jose';

export type DateTimeInput = Date | string | number;

export interface TokenPayload extends JWTPayload {
	userId: number;
}

export enum ROLES {
	USER = 0,
	TRAINER = 1,
	ADMIN = 2,
}

export enum GENDER {
	UNKNOWN = -1,
	FEMALE = 0,
	MALE = 1,
}

export enum TRANSACTION_STATUS {
	PENDING = 0,
	SUCCEED = 1,
	FAILED = 2,
	CANCELLED = 3,
}

export enum TRANSACTION_TYPE {
	MEMBERSHIP = 0,
	PRODUCT = 1,
}