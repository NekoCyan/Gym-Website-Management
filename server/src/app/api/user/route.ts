import type { NextRequest } from 'next/server';
import {
	Response,
	InvalidTypeResponse,
	OutOfRangeResponse,
	UnauthorizedResponse,
	ValidationErrorResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import {
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
	if (user instanceof Error) return ValidationErrorResponse(user);

	return Response({
		data: {
			// username: user.username,
			// email: user.email,

			fullName: user.fullName,
			gender: user.gender, // 1 is Male, 0 is Female.
			address: user.address,
			phoneNumber: user.phoneNumber,
			photo: user.photo,
			proofId: user.proofId,

			roleId: user.roleId,
		},
	});
}

export async function PUT(req: NextRequest) {
	await dbConnect();
	const authorization = req.headers.get('Authorization');
	const tokenObj = (await User.decodeAuthToken(authorization!).catch(
		(e) => e,
	)) as TokenPayload;
	if (tokenObj instanceof Error) return ValidationErrorResponse(tokenObj);

	const body = await req.json();
	let { fullName, gender, address, phoneNumber, photo, proofId } =
		body as Partial<UserInformations>;
	let updateObj: Partial<UserInformations> = {};

	if (typeof gender !== 'undefined') {
		if (isNaN(gender)) return InvalidTypeResponse('gender', 'number');
		if (typeof gender === 'string') gender = parseInt(gender) as -1 | 0 | 1;
		if (gender < -1 || gender > 1)
			return OutOfRangeResponse('gender', -1, 1);

		updateObj.gender = gender;
	}
	if (typeof fullName !== 'undefined') updateObj.fullName = fullName;
	if (typeof address !== 'undefined') updateObj.address = address;
	if (typeof phoneNumber !== 'undefined') updateObj.phoneNumber = phoneNumber;
	if (typeof photo !== 'undefined') updateObj.photo = photo;
	if (typeof proofId !== 'undefined') updateObj.proofId = proofId;

	const result = await User.updateOne(
		{ username: tokenObj.username, email: tokenObj.email },
		{ $set: updateObj },
	);
	if (result.matchedCount === 0) return UnauthorizedResponse();

	return Response({ data: updateObj });
}
