import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	TransactionIdNotFoundResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Transaction from '@/app/models/Transaction';
import {
	FormatShortDateTime,
	SearchParamsToObject,
	TRANSACTION_STATUS,
	TRANSACTION_TYPE,
} from '@/utils';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		const body: { format: string } = SearchParamsToObject(
			req.nextUrl.searchParams,
		);
		let { format } = body;
		const isFormat = format === 'true';

		if (isNaN(id as any)) return TransactionIdNotFoundResponse(id);

		const transaction = await Transaction.getTransactionFromUser(
			BigInt(id),
			self.userId,
		);
		const { name, details, type, price, quantity, status, createdAt } =
			transaction;

		return Response({
			name,
			details,
			type: TRANSACTION_TYPE[type],
			price,
			quantity,
			status: TRANSACTION_STATUS[status],
			createdAt: isFormat ? FormatShortDateTime(createdAt) : createdAt,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
