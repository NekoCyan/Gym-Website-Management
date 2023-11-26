import type { NextRequest } from 'next/server';
import {
	Response,
	ResponseText,
	ValidationErrorResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserHydratedDocument } from '@/app/models/interfaces';
import { ROLES } from '@/utils';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { id } = params;

	await dbConnect();
	const authorization = req.headers.get('Authorization');
	const self = (await User.findByAuthToken(authorization!).catch(
		(e) => e,
	)) as UserHydratedDocument;
	if (self instanceof Error) return ValidationErrorResponse(self);

	if (self.role < ROLES.ADMIN)
		return ValidationErrorResponse(ResponseText.NoPermission);
	const user = (await User.findOne({ userId: id }).catch(
		(e) => e,
	)) as UserHydratedDocument;
	if (user instanceof Error) return ValidationErrorResponse(user);
	if (user == null)
		return ValidationErrorResponse(ResponseText.NotFound(`userId ${id}`));

	return Response({
		data: {
			email: user.email,
			fullName: user.fullName,
			gender: user.gender,
			address: user.address,
			phoneNumber: user.phoneNumber,
			photo: user.photo,
			role: user.role,
		},
	});
}
