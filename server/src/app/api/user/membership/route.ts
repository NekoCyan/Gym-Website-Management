import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';
import { FormatShortDateTime, SearchParamsToObject } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Membership from '@/app/models/Membership';

export async function GET(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		const body: { limit: string; page: string; format: string } =
			SearchParamsToObject(req.nextUrl.searchParams);
		let { limit, page, format } = body;
		const isFormat = format === 'true';

		const transactionList = await Membership.getMembershipList(
			self.userId,
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
		);
		let { list, currentPage, totalPage } = transactionList;
		let resList = list
			.filter((x) => !x.isExpired)
			.map((x) => {
				return {
					planId: x.planId,
					startAt: isFormat ? FormatShortDateTime(x.startAt) : x.startAt,
					endAt: isFormat ? FormatShortDateTime(x.endAt) : x.endAt,
				};
			});

		return Response({ list: resList, currentPage, totalPage });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
