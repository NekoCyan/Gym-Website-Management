import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	PlanIdNotFoundResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Plan from '@/app/models/Plan';
import { AdminRequired, MS, SearchParamsToObject } from '@/utils';
import { PlanData } from '@/app/models/interfaces';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		let { id } = params;
		
		const searchParams: { long: string } = SearchParamsToObject(
			req.nextUrl.searchParams,
		);
		let { long } = searchParams;
		const isLong = long === 'true';

		await dbConnect();

		if (isNaN(id as any)) return PlanIdNotFoundResponse(id);
		const planId = parseInt(id);
		const plan = await Plan.getPlan(planId);
		let { title, details, price, duration } = plan;

		if (isLong) {
			// @ts-ignore when isLong is true, duration is string.
			duration = MS(duration, true);
		}

		return Response({
			title,
			details,
			price,
			duration: duration as string | number,
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

		if (isNaN(id as any)) return PlanIdNotFoundResponse(id);
		const planId = parseInt(id);
		const plan = await Plan.getPlan(planId);

		const body: Partial<Omit<PlanData, 'planId'>> = await req.json();
		let updateObj: typeof body = {};

		// Validate & Extract.
		const planData = await Plan.extractPlanData(body);

		updateObj = { ...planData };

		await plan.update(updateObj);

		return Response({
			...updateObj,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
