import type { NextRequest } from 'next/server';
import {
	RequiredResponse,
	Response,
	ErrorResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserData, UserDetails } from '@/app/models/interfaces';
import { IsUndefined } from '@/utils';

export async function POST(req: NextRequest) {
	try {
		await dbConnect();

		const body: UserData & UserDetails = await req.json();
		let { email, password, fullName, gender, address, phoneNumber } = body;

		if (IsUndefined(email)) return RequiredResponse('email');
		if (IsUndefined(password)) return RequiredResponse('password');
		if (IsUndefined(fullName)) return RequiredResponse('fullName');
		if (IsUndefined(gender)) return RequiredResponse('gender');
		if (IsUndefined(address)) return RequiredResponse('address');
		if (IsUndefined(phoneNumber)) return RequiredResponse('phoneNumber');

		let updateObj = await User.extractUserDetails(body);

		const result = await User.create({
			email,
			password,
			...updateObj,
		});
		const token = await result.generateAuthToken();

		return Response({ token });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
