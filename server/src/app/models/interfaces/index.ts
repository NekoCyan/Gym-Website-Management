import { IUserModel } from './_User';
import { ICounterModel } from './_Counter';
import { IAttendanceModel } from './_Attendance';
import { IPlanModel } from './_Plan';
import { ITransactionModel } from './_Transaction';

export type IModels =
	| ICounterModel
	| IUserModel
	| IAttendanceModel
	| IPlanModel
	| ITransactionModel;

export * from './_User';
export * from './_Counter';
export * from './_Attendance';
export * from './_Plan';
export * from './_Transaction';
