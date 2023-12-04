import type { NextRequest } from 'next/server';
import {
	Response,
	ErrorResponse,
	UserIdNotFoundResponse,
} from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import { AdminRequired, GENDER, ROLES, SearchParamsToObject } from '@/utils';

export async function GET(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);
		AdminRequired(self);

		const body: { limit: string; page: string } = SearchParamsToObject(
			req.nextUrl.searchParams,
		);
		let { limit, page } = body;

		const listCheckIn = await User.getUserList(
			limit ? parseInt(limit) : undefined,
			page ? parseInt(page) : undefined,
		);
		const { list, currentPage, totalPage } = listCheckIn;
        let resList = list.map((x) => {
			let returnObj = {
				userId: x.userId,
                email: x.email,
                role: ROLES[x.role],
                fullName: x.fullName,
                gender: GENDER[x.gender],
                address: x.address,
                phoneNumber: x.phoneNumber,
                photo: x.photo,
                balance: x.balance,
                totalBalance: x.totalBalance,
			};

			return returnObj;
		});

		return Response({ list: resList, currentPage, totalPage });
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
