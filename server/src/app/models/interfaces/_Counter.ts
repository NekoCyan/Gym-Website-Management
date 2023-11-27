import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentResult } from './ExternalDocument';
import { IModels } from './';

export interface CounterData {
	_id: string;
	seq: number;
}
export interface ICounter
	extends CounterData,
		DocumentResult<CounterData>,
		Document {
	_id: string;
}
export interface ICounterMethods {}
export interface ICounterModel extends Model<ICounter, {}, ICounterMethods> {
	getNextSequence(modelName: string, fieldName: string): Promise<number>;
	getNextSequence(model: IModels, fieldName: string): Promise<number>;
}
export type CounterHydratedDocument = HydratedDocument<
	ICounter,
	ICounterMethods
>;
