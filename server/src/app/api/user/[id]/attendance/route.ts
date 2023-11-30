import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	UserIdNotFoundResponse,
} from '@/utils/ResponseHandler';
import { SearchParamsToObject, AdminRequired } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Attendance from '@/app/models/Attendance';

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

		const body: { limit: string; page: string; format: string } =
			SearchParamsToObject(req.nextUrl.searchParams);
		let { limit, page, format } = body;
		const isFormat = format === 'true';

		if (isNaN(id as any)) return UserIdNotFoundResponse(id);
		const userId = parseInt(id);
		const user = await User.getUser(userId);

		const listCheckIn = await Attendance.getCheckInList(
			user.userId,
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
			isFormat,
		);
		const { list, currentPage, totalPage } = listCheckIn;

		return Response({ list, currentPage, totalPage });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
