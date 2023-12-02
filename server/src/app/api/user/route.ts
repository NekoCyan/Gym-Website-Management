import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserData, UserDetails } from '@/app/models/interfaces';
import { GENDER, ROLES } from '@/utils';

export async function GET(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const user = await User.findByAuthToken(authorization!);

		return Response({
			userId: user.userId,
			fullName: user.fullName,
			gender: GENDER[user.gender],
			address: user.address,
			phoneNumber: user.phoneNumber,
			photo: user.photo,
			role: ROLES[user.role],
			balance: user.balance,
			totalBalance: user.totalBalance,
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

		const body: Partial<UserDetails & Pick<UserData, 'password'>> =
			await req.json();
		let updateObj: typeof body = {};

		// Validate & Extract.
		const userInformations = await User.extractUserDetails(body);
		const userData = await User.extractUserData(body);

		updateObj = { ...userInformations };
		if (userData.password) updateObj.password = userData.password;

		await User.updateUser(tokenObj.userId, updateObj);

		return Response({ ...updateObj });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
