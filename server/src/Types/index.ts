import { JWTPayload } from 'jose';

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

export enum TRANSACTION {
	PENDING = 0,
	SUCCEED = 1,
	FAILED = 2,
	CANCELLED = 3,
}
