import type { NextRequest } from 'next/server';
import { Response, ValidationErrorResponse } from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserHydratedDocument } from '@/app/models/interfaces';

export async function POST(req: NextRequest) {
	await dbConnect();

	const { email, password } = await req.json();

	const result = (await User.findByCredentials(email, password).catch(
		(e) => e,
	)) as UserHydratedDocument;

	if (result instanceof Error) return ValidationErrorResponse(result);
	const token = await result.generateAuthToken();

	return Response({ token });
}
