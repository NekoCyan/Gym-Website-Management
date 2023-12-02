import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	ProductIdNotFoundResponse,
	InvalidTypeResponse,
	RequiredResponse,
	MinResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Product from '@/app/models/Product';
import { IsUndefined } from '@/utils';

export async function POST(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;
		if (isNaN(id as any)) return ProductIdNotFoundResponse(id);

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		const body: { quantity: number } = await req.json();
		let { quantity } = body;

		if (IsUndefined(quantity)) return RequiredResponse('quantity');

		if (isNaN(quantity)) return InvalidTypeResponse('quantity', 'number');
		if (typeof quantity === 'string') quantity = parseInt(quantity);
		if (quantity < 1) return MinResponse('quantity', 1);

		await Product.buyProduct(self.userId, parseInt(id), quantity);

		return Response();
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
