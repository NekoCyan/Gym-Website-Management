import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	NotFoundResponse,
	NoPermissionResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { ROLES } from '@/utils';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const { id } = params;

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		if (self.role < ROLES.ADMIN) return NoPermissionResponse();
		if (isNaN(id as any)) return NotFoundResponse(`userId ${id}`);
		const user = await User.findOne({ userId: id });
		if (user == null) return NotFoundResponse(`userId ${id}`);

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
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
