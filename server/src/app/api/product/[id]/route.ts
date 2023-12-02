import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	ProductIdNotFoundResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Product from '@/app/models/Product';
import { AdminRequired, SearchParamsToObject } from '@/utils';
import { ProductData } from '@/app/models/interfaces';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;
		await dbConnect();

		if (isNaN(id as any)) return ProductIdNotFoundResponse(id);
		const productId = parseInt(id);
		const product = await Product.getProduct(productId);
		let { name, details, price, storage } = product;

		return Response({
			name,
			details,
			price,
			storage,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);
		AdminRequired(self);

		if (isNaN(id as any)) return ProductIdNotFoundResponse(id);
		const productId = parseInt(id);
		const product = await Product.getProduct(productId);

		const body: Partial<Omit<ProductData, 'productId'>> = await req.json();
		let updateObj: typeof body = {};

		// Validate & Extract.
		const productData = await Product.extractProductData(body);

		updateObj = { ...productData };

		await product.update(updateObj);

		return Response({
			...updateObj,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);
		AdminRequired(self);

		if (isNaN(id as any)) return ProductIdNotFoundResponse(id);
		const productId = parseInt(id);
		const product = await Product.getProduct(productId);
		
		await product.deleteOne();

		return Response();
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
