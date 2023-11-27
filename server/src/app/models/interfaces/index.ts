import { IUserModel } from './_User';
import { ICounterModel } from './_Counter';

export type IModels = ICounterModel | IUserModel;

export * from './_User';
export * from './_Counter';
