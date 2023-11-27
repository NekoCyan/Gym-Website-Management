import { IUserModel } from './_User';
import { ICounterModel } from './_Counter';
import { IAttendanceModel } from './_Attendance';

export type IModels = ICounterModel | IUserModel | IAttendanceModel;

export * from './_User';
export * from './_Counter';
export * from './_Attendance';
