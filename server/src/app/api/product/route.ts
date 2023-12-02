import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	RequiredResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Product from '@/app/models/Product';
import { AdminRequired, IsUndefined, SearchParamsToObject } from '@/utils';
import { ProductData } from '@/app/models/interfaces';

export async function GET(req: NextRequest) {
	try {
		const body: { limit: string; page: string; long: string } =
			SearchParamsToObject(req.nextUrl.searchParams);
		let { limit, page } = body;

		await dbConnect();

		const productList = await Product.getProductList(
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
		);
		const { list, currentPage, totalPage } = productList;

		return Response({
			list,
			currentPage,
			totalPage,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}

export async function POST(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);
		AdminRequired(self);

		const body: Omit<ProductData, 'productId'> = await req.json();
		let { name, details, price, storage } = body;

		if (IsUndefined(name)) return RequiredResponse('name');
		if (IsUndefined(details)) return RequiredResponse('details');
		if (IsUndefined(price)) return RequiredResponse('price');
		if (IsUndefined(storage)) return RequiredResponse('storage');

		const newProduct = await Product.createProduct(body);

		return Response({
			productId: newProduct.productId,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
