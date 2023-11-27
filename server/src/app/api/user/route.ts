import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserData, UserInformations } from '@/app/models/interfaces';

export async function GET(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const user = await User.findByAuthToken(authorization!);

		return Response({
			data: {
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

export async function PUT(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const tokenObj = await User.decodeAuthToken(authorization!);

		const body: Partial<UserInformations & Pick<UserData, 'password'>> =
			await req.json();
		let updateObj: typeof body = {};

		// Validate & Extract.
		const userInformations = await User.extractUserInformations(body);
		const userData = await User.extractUserData(body);

		updateObj = { ...userInformations };
		if (userData.password) updateObj.password = userData.password;

		await User.updateUser(tokenObj.userId, updateObj);

		return Response({ data: updateObj });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
