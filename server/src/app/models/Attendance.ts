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

// methods.

// middleware.

const AttendanceModel =
	(mongoose.models.Attendance as IAttendanceModel) ||
	mongoose.model<IAttendance, IAttendanceModel>(
		'Attendance',
		AttendanceSchema,
	);

export default AttendanceModel;
