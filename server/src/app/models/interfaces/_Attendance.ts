import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';
import { IModels } from './';

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
	): Promise<Omit<AttendanceData, 'userId'> | null>;
	checkIn(userId: number): Promise<void>;
	checkOut(userId: number): Promise<void>;
}
export type AttendanceHydratedDocument = HydratedDocument<
	IAttendance,
	IAttendanceMethods
>;
