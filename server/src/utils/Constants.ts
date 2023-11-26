import { CreateEnum } from '.';

export const HTTPStatusCode = {
	OK: 200,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	CONFLICT: 409,
	UNPROCESSABLE_ENTITY: 422,
	INTERNAL_SERVER_ERROR: 500,
};

export const PATTERN = {
	USERNAME: /[a-zA-Z0-9_.]+/, // DEPRECATED.
	EMAIL: /^[a-zA-Z0-9_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
};

export const ROLES = CreateEnum({
	USER: 0,
	TRAINER: 1,
	ADMIN: 2,
});

export const GENDER = CreateEnum({ UNKNOWN: -1, FEMALE: 0, MALE: 1 });
