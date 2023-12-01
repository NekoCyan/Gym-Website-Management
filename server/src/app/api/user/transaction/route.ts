import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';
import { FormatShortDateTime, SearchParamsToObject, TRANSACTION } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Transaction from '@/app/models/Transaction';

export async function GET(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		const body: { limit: string; page: string; format: string } =
			SearchParamsToObject(req.nextUrl.searchParams);
		let { limit, page, format } = body;
		const isFormat = format === 'true';

		const transactionList = await Transaction.getTransactionList(
			self.userId,
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
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
				createdAt: isFormat ? FormatShortDateTime(x.createdAt) : x.createdAt,
			};
		});

		return Response({ list: resList, currentPage, totalPage });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
