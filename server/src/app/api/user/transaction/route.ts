import type { NextRequest } from 'next/server';
import { Response, ErrorResponse, InvalidTypeResponse } from '@/utils/ResponseHandler';
import {
	FormatShortDateTime,
	SearchParamsToObject,
	TRANSACTION_STATUS,
	TRANSACTION_TYPE,
} from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Transaction from '@/app/models/Transaction';

export async function GET(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		const body: {
			limit: string;
			page: string;
			format: string;
			type: string;
		} = SearchParamsToObject(req.nextUrl.searchParams);
		let { limit, page, format, type } = body;
		const isFormat = format === 'true';
		if (!type) type = '-1';

		if (type && isNaN(type as any)) return InvalidTypeResponse('type', 'number');

		const transactionList = await Transaction.getTransactionList(
			self.userId,
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
			parseInt(type),
		);
		let { list, currentPage, totalPage } = transactionList;
		let resList = list.map((x) => {
			let returnObj = {
				transactionId: x.transactionId.toString(),
				name: x.name,
				details: x.details,
				type: TRANSACTION_TYPE[x.type],
				price: x.price,
				quantity: x.quantity,
				status: TRANSACTION_STATUS[x.status],
				createdAt: isFormat
					? FormatShortDateTime(x.createdAt)
					: x.createdAt,
			};
			if (parseInt(type) !== -1) delete (returnObj as any).type;

			return returnObj;
		});

		return Response({ list: resList, currentPage, totalPage });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
