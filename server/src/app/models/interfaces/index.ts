import { IUserModel } from './_User';
import { ICounterModel } from './_Counter';
import { IAttendanceModel } from './_Attendance';
import { IPlanModel } from './_Plan';


export type IModels = ICounterModel | IUserModel | IAttendanceModel | IPlanModel;

export * from './_User';
export * from './_Counter';
export * from './_Attendance';
export * from './_Plan';
