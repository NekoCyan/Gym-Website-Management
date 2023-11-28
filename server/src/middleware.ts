import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import {
	BadRequestResponse,
	InvalidAPIRequestResponse,
	UnauthorizedResponse,
} from './utils/ResponseHandler';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	const nextURL = req.nextUrl;

	// pathname when request is: /api/:path* so we need to split and get
	// the first one only to define route (sometime user will try to put
	// "/api/" only then ?.[0] will be undefined if split by "/").
	const route = nextURL.pathname.split('/').slice(2)?.[0];
	// pathname split with "/" and will be ['', 'api', ...routes]

	if (!route) return InvalidAPIRequestResponse();

	try {
		if (['POST', 'PUT', 'PATCH'].some((x) => x == req.method)) {
			const reqText = await req.text();
			if (reqText.trim()) JSON.parse(reqText.trim());
			else throw new Error(`${req.method} must have body.`);
		}
	} catch (e) {
		console.log(e);
		return BadRequestResponse();
	}

	// if route is not in the following list,
	// then we need to check authorization.
	if (!['auth'].some((x) => x == route)) {
		// get authorization in header.
		const authorization = req.headers.get('Authorization');
		if (!authorization) return UnauthorizedResponse();
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	runtime: 'experimental-edge',
	matcher: '/api/:path*',
};
