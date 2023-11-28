import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';
import { SearchParamsToObject } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Attendance from '@/app/models/Attendance';

export async function GET(req: NextRequest) {
	try {
		const body: { limit: string, page: string, format: string } = SearchParamsToObject(req.nextUrl.searchParams);
		let { limit, page, format } = body;
		const isFormat = format === 'true';

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		const listCheckIn = await Attendance.getListCheckIn(
			self.userId,
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
