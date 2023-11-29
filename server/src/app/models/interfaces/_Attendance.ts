import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';

export interface AttendanceData {
	userId: number;
	timeIn: string;
	timeOut: string;
}
export interface IAttendance
	extends AttendanceData,
		DocumentResult<AttendanceData>,
		Document {}
export interface IAttendanceMethods {}
export interface IAttendanceModel
	extends Model<IAttendance, {}, IAttendanceMethods> {
	getLastCheckIn(
		userId: number,
	): Promise<Pick<AttendanceData, 'timeIn' | 'timeOut'> | null>;
	checkIn(userId: number): Promise<void>;
	checkOut(userId: number): Promise<void>;
	/**
	 * @param userId
	 * @param limit limit number to get document (limit default 20 - max 100).
	 * @param page start from 1 (also default with 1).
	 */
	getCheckInList(
		userId: number,
		limit?: number,
		page?: number,
		formatTime?: boolean,
	): Promise<{
		list: Pick<AttendanceData, 'timeIn' | 'timeOut'>[];
		currentPage: number;
		totalPage: number;
	}>;
}
export type AttendanceHydratedDocument = HydratedDocument<
	IAttendance,
	IAttendanceMethods
>;
