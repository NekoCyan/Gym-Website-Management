import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { HTTPStatusCode, Response } from './utils';

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
	try {
		if (req.method == 'POST') {
			const reqText = await req.text();
			if (reqText.trim()) JSON.parse(reqText.trim());
			else throw new Error('POST body must have body.');
		}
	} catch (e) {
		return Response({ message: 'Bad Request' }, HTTPStatusCode.BAD_REQUEST);
	}
	const nextURL = req.nextUrl;

	// pathname when request is: /api/:path* so we need to split and get
	// the first one only to define route (sometime user will try to put
	// /api/ only then ?.[0] will be undefined).
	const route = nextURL.pathname.split('/').slice(2)?.[0];

	if (!['login', 'register'].some((x) => x == route)) {
		// get authorization in header.
		const authorization = req.headers.get('Authorization');
		if (!authorization)
			return Response(
				{ message: 'Unauthorized.' },
				HTTPStatusCode.UNAUTHORIZED,
			);

		// verify authorization.
		// const verify = (await JWT_Verify(authorization)) as any;
		// when verify is null.
		// if (!verify) {
		// 	return Response(
		// 		{ message: 'Unauthorized.' },
		// 		HTTPStatusCode.UNAUTHORIZED,
		// 	);
		// }

		// we set _username and _email to useful define user.
		const next = NextResponse.next();
		// next.headers.set('_username', verify.username);
		// next.headers.set('_email', verify.email);

		return next;
	}

	return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
	// runtime: 'experimental-edge',
	matcher: '/api/:path*',
};
