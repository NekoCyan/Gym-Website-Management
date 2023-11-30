import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Transaction from '@/app/models/Transaction';
import { FormatDateTime, SearchParamsToObject, TRANSACTION } from '@/utils';

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

		const transaction = await Transaction.getTransactionFromUser(
			BigInt(id),
			self.userId,
		);
		const { name, details, price, quantity, status, createdAt } = transaction;

		return Response({
			name,
			details,
			price,
			quantity,
			status: TRANSACTION[status],
			createdAt: isFormat ? FormatDateTime(createdAt) : createdAt,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
