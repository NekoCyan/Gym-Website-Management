import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { UserData } from '@/app/models/interfaces';

export async function POST(req: NextRequest) {
	try {
		await dbConnect();

		const body: Pick<UserData, 'email' | 'password'> = await req.json();
		const { email, password } = body;

		const result = await User.findByCredentials(email, password);
		const token = await result.generateAuthToken();

		return Response({ token });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
