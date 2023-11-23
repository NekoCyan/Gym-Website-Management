import type { NextRequest } from 'next/server';
import { Response, HandleValidationError } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserHydratedDocument } from '@/app/models/interfaces';

export async function GET(req: NextRequest) {
	await dbConnect();
	const authorization = req.headers.get('Authorization');

	const user = (await User.findByAuthToken(authorization).catch(
		(e) => e,
	)) as UserHydratedDocument;
	if (user instanceof Error) return HandleValidationError(user);

	return Response({
		data: {
			username: user.username,
			email: user.email,
			fullName: user.fullName,
			address: user.address,
			phoneNumber: user.phoneNumber,
			role: user.role,
		},
	});
}
