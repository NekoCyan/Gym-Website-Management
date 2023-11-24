import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { HTTPStatusCode } from './';

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
			}
		},
	);
}

export function InvalidTypeResponse(
	variable: string,
	allowType?: 'string' | 'number',
) {
	let errorMessage = `Invalid type of ${variable}`;
	if (allowType) {
		errorMessage += ` (Only accept ${allowType})`;
	}
	errorMessage += '.';

	return ValidationErrorResponse(new Error(errorMessage));
}

export function OutOfRangeResponse(variable: string, from: number, to: number) {
	let errorMessage = `Invalid range of ${variable} (Only accept from ${from} to ${to}).`;

	return ValidationErrorResponse(new Error(errorMessage));
}

export function UnauthorizedResponse() {
	return ValidationErrorResponse(new Error('Unauthorized.'));
}

export function ValidationErrorResponse(err: Error | mongoose.Error) {
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
	else if (resLower.includes('not found'))
		statusCode = HTTPStatusCode.NOT_FOUND;
	else if (resLower.includes('already exists'))
		statusCode = HTTPStatusCode.CONFLICT;
	else if (
		['less than', 'greater than', 'range of'].some(
			(x) => x.toLowerCase() == resLower,
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
