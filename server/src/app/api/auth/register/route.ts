import type { NextRequest } from 'next/server';
import {
	RequiredResponse,
	Response,
	ErrorResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import {
	UserData,
	UserHydratedDocument,
	UserInformations,
} from '@/app/models/interfaces';
import { IsUndefined } from '@/utils';

export async function POST(req: NextRequest) {
	await dbConnect();

	const body = (await req.json()) as UserData & UserInformations;
	let { email, password, fullName, gender, address, phoneNumber } = body;

	if (IsUndefined(email)) return RequiredResponse('email');
	if (IsUndefined(password)) return RequiredResponse('password');
	if (IsUndefined(fullName)) return RequiredResponse('fullName');
	if (IsUndefined(gender)) return RequiredResponse('gender');
	if (IsUndefined(address)) return RequiredResponse('address');
	if (IsUndefined(phoneNumber)) return RequiredResponse('phoneNumber');

	let updateObj = (await User.extractUserInformations(body).catch(
		(e) => e,
	)) as Partial<UserInformations>;
	if (updateObj instanceof Error) return ErrorResponse(updateObj);

	const result = (await User.create({
		email,
		password,
		...updateObj,
	}).catch((e) => e)) as UserHydratedDocument;

	if (result instanceof Error) return ErrorResponse(result);
	const token = await result.generateAuthToken();

	return Response({ token });
}
