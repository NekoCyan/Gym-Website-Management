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

export const ResponseText = {
	// API Response.
	InvalidAPIRequest: `Invalid API request.`,

	// System Response.
	Invalid: (variable: string) => {
		return `${variable} is invalid.`;
	},
	InvalidType: (variable: string, allowType?: 'string' | 'number') => {
		let errorMessage = `Invalid type of ${variable}`;
		if (allowType) {
			errorMessage += ` (Only accept ${allowType})`;
		}
		errorMessage += '.';

		return errorMessage;
	},
	InvalidPageNumber: (page: number) => {
		return `Invalid page number ${page}.`;
	},
	MinLength: (variable: string, minLength: number) => {
		return `${variable} cannot be less than ${minLength} characters.`;
	},
	MaxLength: (variable: string, maxLength: number) => {
		return `${variable} cannot be more than ${maxLength} characters.`;
	},
	OutOfRange: (variable: string, from: number, to: number) => {
		return `Invalid range of ${variable} (Only accept from ${from} to ${to}).`;
	},
	AlreadyExists: (variable: string) => {
		return `${variable} is already exists.`;
	},
	NotExists: (variable: string) => {
		return `${variable} does not exists.`;
	},
	NotMatch: (variable: string) => {
		return `${variable} does not match.`;
	},
	NotFound: (variable: string) => {
		return `${variable} is not found.`;
	},
	Required: (variable: string) => {
		return `${variable} is required.`;
	},
	BadRequest: `Bad Request.`,
	NoPermission: `You do not have permission to access this resource.`,
	Unauthorized: `Unauthorized.`,

	// User.
	OldPasswordSameNew: `The new password cannot be the same with the old password.`,
	UserIdNotFound: (variable: string | number) => {
		return `User with ID ${variable.toString()} is not found.`;
	},

	// Attendance.
	NoCheckInRecord: `You have not check in yet.`,
	AlreadyCheckedIn: (stringTime: string) => {
		return `You have already checked in since ${stringTime} in the last time, please check out first before check in again.`;
	},
};
