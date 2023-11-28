import type { NextRequest } from 'next/server';
import { Response, ErrorResponse } from '@/utils/ResponseHandler';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import Attendance from '@/app/models/Attendance';

export async function POST(req: NextRequest) {
	try {
		await dbConnect();
		const authorization = req.headers.get('Authorization');
		const self = await User.findByAuthToken(authorization!);

		await Attendance.checkIn(self.userId);

		return Response();
	} catch (e: any) {
		return ErrorResponse(e);
	}
}
