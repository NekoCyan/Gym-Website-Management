import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { SignJWT, jwtVerify } from 'jose';
import { HTTPStatusCode } from './';

export function Response(data: object, status: number = 200) {
	return NextResponse.json(
		{
			message: 'ok',
			...data,
			success: status >= 200 && status < 300,
		},
		{ status },
	);
}

export function HandleValidationError(err: any) {
	console.log(err);
	if (err instanceof mongoose.Error.ValidationError) {
		const errors = err.errors;
		const obj = Object.keys(errors);
		let statusCode;
		let responseMessage = '';

		if (errors[obj[0]] instanceof mongoose.Error.ValidatorError) {
			responseMessage =
				// @ts-ignore
				errors[obj[0]].properties?.message ?? errors[obj[0]].message;
		}

		const resLower = responseMessage.toLowerCase();
		if (resLower.includes('unauthorized'))
			statusCode = HTTPStatusCode.UNAUTHORIZED;
		else if (resLower.includes('not found'))
			statusCode = HTTPStatusCode.NOT_FOUND;
		else if (resLower.includes('already exists'))
			statusCode = HTTPStatusCode.CONFLICT;
		else if (
			['less than', 'greater than'].some(
				(x) => x.toLowerCase() == resLower,
			)
		)
			statusCode = HTTPStatusCode.UNPROCESSABLE_ENTITY;
		else statusCode = HTTPStatusCode.BAD_REQUEST;

		return Response(
			{
				message: responseMessage,
			},
			statusCode,
		);
	} else {
		return Response(
			{
				message: err?.message ?? 'Unknown error',
			},
			HTTPStatusCode.BAD_REQUEST,
		);
	}
}

/**
 * @param username
 * @param expiresIn Seconds.
 * @returns
 */
export async function JWT_Sign(payload: object, expiresIn: number) {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET is not defined in env.');

	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + expiresIn;

	return new SignJWT({
		...payload,
	})
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setExpirationTime(exp)
		.setIssuedAt(iat)
		.setNotBefore(iat)
		.sign(new TextEncoder().encode(secret));
}

export async function JWT_Verify(token: string) {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET is not defined in env.');

	if (!token) return null;

	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(secret),
		);

		// run some checks on the returned payload, perhaps you expect some specific values

		// if its all good, return it, or perhaps just return a boolean
		return payload;
	} catch (e) {
		return null;
	}
}

export function Capitalize(str: string) {
	if (!str || typeof str !== 'string') return str;

	return str.charAt(0).toUpperCase() + str.slice(1);
}
