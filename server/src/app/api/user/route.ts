import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import {
	UserData,
	UserHydratedDocument,
	UserInformations,
} from '@/app/models/interfaces';
import { TokenPayload } from '@/Types';

export async function GET(req: NextRequest) {
	await dbConnect();
	const authorization = req.headers.get('Authorization');

	const user = (await User.findByAuthToken(authorization!).catch(
		(e) => e,
	)) as UserHydratedDocument;
	if (user instanceof Error) return ErrorResponse(user);

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
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const authorization = req.headers.get('Authorization');
	const tokenObj = (await User.decodeAuthToken(authorization!).catch(
		(e) => e,
	)) as TokenPayload;
	if (tokenObj instanceof Error) return ErrorResponse(tokenObj);

	const body = (await req.json()) as Partial<
		UserInformations & Pick<UserData, 'password'>
	>;
	let updateObj: typeof body = {};

	// UserInformations.
	const userInformations = (await User.extractUserInformations(body).catch(
		(e) => e,
	)) as Partial<UserInformations>;
	if (userInformations instanceof Error)
		return ErrorResponse(userInformations);
	// UserData.
	const userData = (await User.extractUserData(body).catch(
		(e) => e,
	)) as Partial<UserData>;
	if (userData instanceof Error) return ErrorResponse(userData);

	updateObj = { ...userInformations };
	if (userData.password) updateObj.password = userData.password;

	const result = (await User.updateUser(tokenObj.userId, updateObj).catch(
		(e) => e,
	)) as UserHydratedDocument;
	if (result instanceof Error) return ErrorResponse(result);

	return Response({ data: updateObj });
}
