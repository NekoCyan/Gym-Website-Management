import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	UserIdNotFoundResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import {
	AdminRequired,
	FormatDateTime,
	SearchParamsToObject,
	TRANSACTION,
} from '@/utils';
import Transaction from '@/app/models/Transaction';

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

		const transactionList = await Transaction.getTransactionList(
			user.userId,
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
			isFormat,
		);
		let { list, currentPage, totalPage } = transactionList;
		let resList = list.map((x) => {
			return {
				transactionId: x.transactionId.toString(),
				name: x.name,
				details: x.details,
				price: x.price,
				quantity: x.quantity,
				status: TRANSACTION[x.status],
				createdAt: isFormat ? FormatDateTime(x.createdAt) : x.createdAt,
			};
		});

		return Response({ list: resList, currentPage, totalPage });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
