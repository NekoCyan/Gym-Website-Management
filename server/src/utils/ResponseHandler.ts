import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { HTTPStatusCode, ResponseText } from './';

export function InvalidTypeResponse(
	variable: string,
	allowType?: 'string' | 'number',
) {
	return ErrorResponse(
		new Error(ResponseText.InvalidType(variable, allowType)),
	);
}
export function InvalidResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.Invalid(variable)));
}
export function MinLengthResponse(variable: string, minLength: number) {
	return ErrorResponse(
		new Error(ResponseText.MinLength(variable, minLength)),
	);
}
export function MaxLengthResponse(variable: string, maxLength: number) {
	return ErrorResponse(
		new Error(ResponseText.MaxLength(variable, maxLength)),
	);
}
export function OutOfRangeResponse(variable: string, from: number, to: number) {
	return ErrorResponse(
		new Error(ResponseText.OutOfRange(variable, from, to)),
	);
}
export function AlreadyExistsResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.AlreadyExists(variable)));
}
export function NotExistsResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.NotExists(variable)));
}
export function NotMatchResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.NotMatch(variable)));
}
export function NotFoundResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.NotFound(variable)));
}
export function RequiredResponse(variable: string) {
	return ErrorResponse(new Error(ResponseText.Required(variable)));
}
export function OldPasswordSameNewResponse() {
	return ErrorResponse(new Error(ResponseText.OldPasswordSameNew));
}
export function BadRequestResponse() {
	return ErrorResponse(new Error(ResponseText.BadRequest));
}
export function NoPermissionResponse() {
	return ErrorResponse(new Error(ResponseText.NoPermission));
}
export function UnauthorizedResponse() {
	return ErrorResponse(new Error(ResponseText.Unauthorized));
}

export function Response<T extends { [key: string]: any }>(
	data: T = {} as T,
	status: number = 200,
) {
	if (typeof data !== 'object')
		throw new Error(
			'Parameter data must be an Object, please contact Admin for more informations.',
		);
	if (typeof status !== 'number')
		throw new Error(
			'Parameter status must be a Number, please contact Admin for more informations.',
		);

	type OmitMessage<T> = 'message' extends keyof T ? Omit<T, 'message'> : T;

	let message = 'OK';
	if ('message' in data) {
		message = data.message;
		delete data.message;
	}

	let obj: {
		message: string;
		code: number;
		success: boolean;
		data: OmitMessage<T>;
	} = {
		message,
		code: status,
		success: status >= 200 && status < 300,
		data: data as OmitMessage<T>,
	};

	return NextResponse.json(obj, {
		status,
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

export function ErrorResponse(
	err: Error | mongoose.Error | string,
	data?: { [key: string]: any },
) {
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
			...data,
		},
		statusCode,
	);
}
