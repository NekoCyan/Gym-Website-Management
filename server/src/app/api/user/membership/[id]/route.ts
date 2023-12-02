import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	PlanIdNotFoundResponse,
	MembershipExpiredResponse,
} from '@/utils/ResponseHandler';
import { FormatShortDateTime, SearchParamsToObject } from '@/utils';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Membership from '@/app/models/Membership';

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

		if (isNaN(id as any)) return PlanIdNotFoundResponse(id);

		const membership = await Membership.getMembership(
			self.userId,
			parseInt(id),
		);
		if (membership.isExpired)
			return MembershipExpiredResponse(membership.planId);

		const { startAt, endAt } = membership;

		return Response({
			startAt: isFormat ? FormatShortDateTime(startAt) : startAt,
			endAt: isFormat ? FormatShortDateTime(endAt) : endAt,
		});
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
