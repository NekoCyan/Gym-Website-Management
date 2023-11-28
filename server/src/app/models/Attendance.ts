import mongoose from 'mongoose';
import {
	AttendanceData,
	IAttendance,
	IAttendanceMethods,
	IAttendanceModel,
} from './interfaces';
import { FormatDateTime, ResponseText } from '@/utils';

const AttendanceSchema = new mongoose.Schema<
	IAttendance,
	IAttendanceModel,
	IAttendanceMethods
>({
	userId: {
		type: Number,
		required: true,
	},
	timeIn: {
		type: String,
		required: true,
	},
	timeOut: {
		type: String,
		default: '',
	},
});

// validation.

// statics.
AttendanceSchema.static(
	'getLastCheckIn',
	async function (
		userId: number,
	): Promise<Pick<AttendanceData, 'timeIn' | 'timeOut'> | null> {
		const getLastCheckIn =
			(
				await this.aggregate()
					.match({ userId })
					.sort({ _id: -1 })
					.limit(1)
					.project({ _id: 0, timeIn: 1, timeOut: 1 })
					.exec()
			)[0] || null;

		return getLastCheckIn;
	},
);
AttendanceSchema.static(
	'checkIn',
	async function (userId: number): Promise<void> {
		const lastCheckIn = await this.getLastCheckIn(userId);

		if (lastCheckIn != null && lastCheckIn.timeOut === '')
			throw new Error(
				ResponseText.AlreadyCheckedIn(
					FormatDateTime(lastCheckIn.timeIn),
				),
			);

		await this.create({ userId, timeIn: new Date().toISOString() });
	},
);
AttendanceSchema.static(
	'checkOut',
	async function (userId: number): Promise<void> {
		const lastCheckIn = await this.getLastCheckIn(userId);

		if (lastCheckIn == null || lastCheckIn.timeOut !== '')
			throw new Error(ResponseText.NoCheckInRecord);

		await this.updateOne(
			{
				userId,
				timeIn: lastCheckIn.timeIn,
			},
			{
				timeOut: new Date().toISOString(),
			},
		);
	},
);
AttendanceSchema.static(
	'getListCheckIn',
	async function (
		userId: number,
		limit: number = 20,
		page: number = 1,
		formatTime: boolean = false,
	): Promise<{
		list: Pick<AttendanceData, 'timeIn' | 'timeOut'>[];
		currentPage: number;
		totalPage: number;
	}> {
		if (typeof limit !== 'number')
			throw new Error(ResponseText.InvalidType('limit', 'number'));
		if (limit < 1) throw new Error(ResponseText.InvalidPageNumber(limit));

		if (typeof page !== 'number')
			throw new Error(ResponseText.InvalidType('page', 'number'));
		if (page < 1) throw new Error(ResponseText.InvalidPageNumber(page));

		limit > 100 && (limit = 100);

		const totalDocument = await this.countDocuments({ userId });
		const totalPage = Math.ceil(totalDocument / limit);
		let listCheckIn;

		if (page > totalPage) {
			listCheckIn = [];
		} else {
			// Skip and Limit will works like the following:
			// Get array from {skipFromPage} to {limitNext}.
			const limitNext = page * limit;
			const skipFromPage = limitNext - limit;

			const getListCheckIn = await this.aggregate()
				.match({ userId })
				.sort({ _id: -1 })
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, timeIn: 1, timeOut: 1 })
				.exec();
			
			listCheckIn = getListCheckIn;

			if (formatTime) {
				listCheckIn = getListCheckIn.map((checkIn) => {
					return {
						timeIn: FormatDateTime(checkIn.timeIn),
						timeOut: FormatDateTime(checkIn.timeOut),
					};
				});
			}
		}

		return {
			list: listCheckIn,
			currentPage: page,
			totalPage,
		};
	},
);

// methods.

// middleware.

const AttendanceModel =
	(mongoose.models.Attendance as IAttendanceModel) ||
	mongoose.model<IAttendance, IAttendanceModel>(
		'Attendance',
		AttendanceSchema,
	);

export default AttendanceModel;
