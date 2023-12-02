import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	UserIdNotFoundResponse,
	MembershipExpiredResponse,
	PlanIdNotFoundResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import {
	AdminRequired,
	FormatShortDateTime,
	SearchParamsToObject,
} from '@/utils';
import Membership from '@/app/models/Membership';

export async function GET(
	req: NextRequest,
	{ params }: { params: { id: string; membershipid: string } },
) {
	try {
		let { id, membershipid } = params;

		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);
		AdminRequired(self);

		const body: { format: string } = SearchParamsToObject(
			req.nextUrl.searchParams,
		);
		let { format } = body;
		const isFormat = format === 'true';

		if (isNaN(id as any)) return UserIdNotFoundResponse(id);
		if (isNaN(membershipid as any))
			return PlanIdNotFoundResponse(membershipid);

		const userId = parseInt(id);
		const user = await User.getUser(userId);

		const membership = await Membership.getMembership(
			user.userId,
			parseInt(membershipid),
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
