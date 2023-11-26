import { SignJWT, jwtVerify } from 'jose';
import { TokenPayload } from '@/Types';

/**
 * @param username
 * @param expiresIn Seconds.
 * @returns
 */
export async function JWT_Sign(payload: TokenPayload, expiresIn: number) {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET is not defined in env.');

	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + expiresIn;

	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setExpirationTime(exp)
		.setIssuedAt(iat)
		.setNotBefore(iat)
		.sign(new TextEncoder().encode(EncodeBase64(secret)));
}

export async function JWT_Verify(token: string) {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET is not defined in env.');

	if (!token) return null;

	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(EncodeBase64(secret)),
		);

		// run some checks on the returned payload, perhaps you expect some specific values

		// if its all good, return it, or perhaps just return a boolean
		return payload as TokenPayload;
	} catch (e) {
		return null;
	}
}

export function EncodeBase64(str: string, depth: number = 1) {
	if (!str || depth <= 0) return str;

	return EncodeBase64(btoa(str), depth - 1);
}

export function DecodeBase64(str: string, depth: number = 1) {
	if (!str || depth <= 0) return str;

	try {
		return DecodeBase64(atob(str), depth - 1);
	} catch (e) {
		return str;
	}
}

export function Capitalize(str: string) {
	if (!str || typeof str !== 'string') return str;

	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function IsUndefined(variable: any): boolean {
	return typeof variable === 'undefined';
}