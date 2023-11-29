import mongoose from 'mongoose';
import {
	IAttendance,
	IAttendanceMethods,
	IAttendanceModel,
} from './interfaces';
import { FormatDateTime, ResponseText, ValidateForList } from '@/utils';

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

// methods.

// statics.
AttendanceSchema.static(
	'getLastCheckIn',
	async function (
		userId: number,
	): Promise<ReturnType<IAttendanceModel['getLastCheckIn']>> {
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
AttendanceSchema.static('checkIn', async function (userId: number): Promise<
	ReturnType<IAttendanceModel['checkIn']>
> {
	const lastCheckIn = await this.getLastCheckIn(userId);

	if (lastCheckIn != null && lastCheckIn.timeOut === '')
		throw new Error(
			ResponseText.AlreadyCheckedIn(FormatDateTime(lastCheckIn.timeIn)),
		);

	await this.create({ userId, timeIn: new Date().toISOString() });
});
AttendanceSchema.static('checkOut', async function (userId: number): Promise<
	ReturnType<IAttendanceModel['checkOut']>
> {
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
});
AttendanceSchema.static(
	'getCheckInList',
	async function (
		userId: number,
		_limit: number = 20,
		_page: number = 1,
		formatTime: boolean = false,
	): Promise<ReturnType<IAttendanceModel['getCheckInList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

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

			const getCheckInList = await this.aggregate()
				.match({ userId })
				.sort({ _id: -1 })
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, timeIn: 1, timeOut: 1 })
				.exec();

			listCheckIn = getCheckInList;

			if (formatTime) {
				listCheckIn = getCheckInList.map((checkIn) => {
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

// middleware.

const AttendanceModel =
	(mongoose.models.Attendance as IAttendanceModel) ||
	mongoose.model<IAttendance, IAttendanceModel>(
		'Attendance',
		AttendanceSchema,
	);

export default AttendanceModel;
