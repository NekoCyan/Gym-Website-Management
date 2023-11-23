import type { NextRequest } from 'next/server';
import { Response, HandleValidationError } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserHydratedDocument } from '@/app/models/interfaces';

export async function POST(req: NextRequest) {
	await dbConnect();

	const { username, password } = await req.json();

	const result = (await User.findByCredentials(username, password).catch(
		(e) => e,
	)) as UserHydratedDocument;

	if (result instanceof Error) return HandleValidationError(result);
	const token = await result.generateAuthToken(60);

	return Response({ token });
}
