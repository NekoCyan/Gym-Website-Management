import type { NextRequest } from 'next/server';
import { Response, HandleValidationError } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserHydratedDocument } from '@/app/models/interfaces';

export async function POST(req: NextRequest) {
	await dbConnect();

	const { username, password, email, fullName, address, phoneNumber } =
		await req.json();

	const result = (await User.create({
		username,
		password,
		email,
		fullName: fullName ?? '',
		address: address ?? '',
		phoneNumber: phoneNumber ?? '',
	}).catch((e) => e)) as UserHydratedDocument;

	if (result instanceof Error) return HandleValidationError(result);
	const token = await result.generateAuthToken();

	return Response({ token });
}
