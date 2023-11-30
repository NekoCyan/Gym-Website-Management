import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	UserIdNotFoundResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { AdminRequired, GENDER, ROLES } from '@/utils';
import { UserData, UserDetails } from '@/app/models/interfaces';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);
		AdminRequired(self);

		if (isNaN(id as any)) return UserIdNotFoundResponse(id);
		const userId = parseInt(id);
		const user = await User.getUser(userId);

		return Response({
			email: user.email,
			fullName: user.fullName,
			gender: GENDER[user.gender],
			address: user.address,
			phoneNumber: user.phoneNumber,
			photo: user.photo,
			role: ROLES[user.role],
			cash: user.cash,
			totalCash: user.totalCash,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);
		AdminRequired(self);

		if (isNaN(id as any)) return UserIdNotFoundResponse(id);
		const userId = parseInt(id);
		const user = await User.getUser(userId);

		const body: Partial<UserDetails & Omit<UserData, 'userId'>> =
			await req.json();
		let updateObj: typeof body = {};

		// Validate & Extract.
		const userInformations = await User.extractUserDetails(body);
		const userData = await User.extractUserData(body);

		updateObj = { ...userInformations, ...userData };

		await user.update(updateObj);

		return Response({ ...updateObj });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
