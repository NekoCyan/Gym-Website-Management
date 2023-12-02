import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	RequiredResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Plan from '@/app/models/Plan';
import { AdminRequired, IsUndefined, SearchParamsToObject } from '@/utils';
import { PlanData } from '@/app/models/interfaces';

export async function GET(req: NextRequest) {
	try {
		const body: { limit: string; page: string; long: string } =
			SearchParamsToObject(req.nextUrl.searchParams);
		let { limit, page, long } = body;
		const isLong = long === 'true';

		await dbConnect();

		const planList = await Plan.getPlanList(
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
			isLong,
		);
		const { list, currentPage, totalPage } = planList;

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

		const body: Omit<PlanData, 'planId'> = await req.json();
		let { title, details, price, duration } = body;

		if (IsUndefined(title)) return RequiredResponse('title');
		if (IsUndefined(details)) return RequiredResponse('details');
		if (IsUndefined(price)) return RequiredResponse('price');
		if (IsUndefined(duration)) return RequiredResponse('duration');

		const newPlan = await Plan.createPlan(body);

		return Response({
			planId: newPlan.planId,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
