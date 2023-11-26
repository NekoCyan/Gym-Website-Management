import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { HTTPStatusCode } from './';

export const ResponseText = {
	InvalidType: (variable: string, allowType?: 'string' | 'number') => {
		let errorMessage = `Invalid type of ${variable}`;
		if (allowType) {
			errorMessage += ` (Only accept ${allowType})`;
		}
		errorMessage += '.';

		return errorMessage;
	},
	Invalid: (variable: string) => {
		return `${variable} is invalid.`;
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
	OldPasswordSameNew: `The new password cannot be the same with the old password.`,
	BadRequest: `Bad Request.`,
	NoPermission: `You do not have permission to access this resource.`,
	Unauthorized: `Unauthorized.`,
};

export function Response(data: object = {}, status: number = 200) {
	return NextResponse.json(
		{
			message: 'OK',
			...data,
			code: status,
			success: status >= 200 && status < 300,
		},
		{
			status,
			headers: {
				'Content-Type': 'application/json',
			},
		},
	);
}

export function InvalidTypeResponse(
	variable: string,
	allowType?: 'string' | 'number',
) {
	return ErrorResponse(
		new Error(ResponseText.InvalidType(variable, allowType)),
	);
}

export function OutOfRangeResponse(variable: string, from: number, to: number) {
	return ErrorResponse(
		new Error(ResponseText.OutOfRange(variable, from, to)),
	);
}

export function UnauthorizedResponse() {
	return ErrorResponse(new Error(ResponseText.Unauthorized));
}

export function RequiredResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.Required(variable)));
}

export function ErrorResponse(err: Error | mongoose.Error | string) {
	if (typeof err === 'string') err = new Error(err);
	
	console.log(err);
	let statusCode;
	let responseMessage = '';

	if (err instanceof mongoose.Error.ValidationError) {
		const errors = err.errors;
		const obj = Object.keys(errors);

		if (errors[obj[0]] instanceof mongoose.Error.ValidatorError) {
			responseMessage =
				// @ts-ignore
				errors[obj[0]].properties?.message ?? errors[obj[0]].message;
		}
	} else {
		responseMessage = err.message;
	}

	const resLower = responseMessage.toLowerCase();
	if (resLower.includes('unauthorized'))
		statusCode = HTTPStatusCode.UNAUTHORIZED;
	else if (
		['forbidden', 'not have permission', 'no permission'].some((x) =>
			resLower.includes(x.toLowerCase()),
		)
	)
		statusCode = HTTPStatusCode.FORBIDDEN;
	else if (resLower.includes('not found'))
		statusCode = HTTPStatusCode.NOT_FOUND;
	else if (resLower.includes('already exists'))
		statusCode = HTTPStatusCode.CONFLICT;
	else if (
		['less than', 'greater than', 'range of'].some((x) =>
			resLower.includes(x.toLowerCase()),
		)
	)
		statusCode = HTTPStatusCode.UNPROCESSABLE_ENTITY;
	else statusCode = HTTPStatusCode.BAD_REQUEST;

	return Response(
		{
			message: responseMessage ?? 'Unknown error.',
		},
		statusCode,
	);
}
