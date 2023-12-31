import mongoose from 'mongoose';
import {
	ICounter,
	ICounterMethods,
	ICounterModel,
	IModels,
} from './interfaces';
import { ResponseText } from '@/utils';

const CounterSchema = new mongoose.Schema<
	ICounter,
	ICounterModel,
	ICounterMethods
>({
	_id: {
		type: String,
		required: [true, ResponseText.Required('_id')],
	},
	seq: {
		type: Number,
		default: 0,
	},
});

// statics.
CounterSchema.static(
	'getNextSequence',
	async function (
		modelName: IModels | string,
		fieldName: string,
	): Promise<number> {
		if (typeof modelName === 'function') modelName = modelName.modelName;

		const counter: ICounter = await this.findOneAndUpdate(
			{ _id: `${modelName}.${fieldName}` },
			{ $inc: { seq: 1 } },
			{ new: true, upsert: true },
		);

		return counter.seq;
	},
);

const CounterModel =
	// @ts-ignore
	(mongoose.models.Counter as ICounterModel) ||
	mongoose.model<ICounter, ICounterModel>('Counter', CounterSchema);

export default CounterModel;
