import mongoose from 'mongoose';
import { PlanData, IPlan, IPlanMethods, IPlanModel } from './interfaces';
import { IsUndefined, MS, ResponseText, ValidateForList } from '@/utils';
import CounterModel from './Counter';

const PlanSchema = new mongoose.Schema<IPlan, IPlanModel, IPlanMethods>({
	planId: {
		type: Number,
	},
	title: {
		type: String,
		required: [true, ResponseText.Required('title')],
		maxlength: [100, ResponseText.MaxLength('title', 100)],
	},
	details: {
		type: String,
		required: [true, ResponseText.Required('details')],
	},
	price: {
		type: Number,
		required: [true, ResponseText.Required('price')],
	},
	duration: {
		type: Number,
		required: [true, ResponseText.Required('duration')],
	},
});

// validation.

// methods.
PlanSchema.method(
	'update',
	async function (
		data: Partial<PlanData>,
		extraData: { [key: string]: any } = {},
	): Promise<ReturnType<IPlanMethods['update']>> {
		let updateObj: Partial<PlanData> & {
			[key: string]: any;
		} = {};

		const planData: Partial<PlanData> = await PlanModel.extractPlanData(
			data,
		);

		// Group validated fields to update.
		updateObj = { ...planData };

		// Group extra data to update.
		updateObj = { ...updateObj, ...extraData };

		for (let key in updateObj) {
			if (Object.hasOwn(this._doc, key)) {
				(this as any)[key] = updateObj[key];
			} else {
				delete updateObj[key];
			}
		}

		return this.save();
	},
);

// statics.
PlanSchema.static('getPlan', async function (planId: number): Promise<
	ReturnType<IPlanModel['getPlan']>
> {
	const plan = await this.findOne({ planId });
	if (!plan) {
		throw new Error(ResponseText.PlanIdNotFound(planId));
	}

	return plan;
});
PlanSchema.static(
	'extractPlanData',
	async function (
		data: Partial<PlanData>,
	): Promise<ReturnType<IPlanModel['extractPlanData']>> {
		let { title, details, price, duration } = data;
		let updateObj: Partial<PlanData> = {};

		const validateTitle = (title: any) => {
			if (typeof title !== 'string')
				throw new Error(ResponseText.InvalidType('title', 'string'));
			// if (title.length > 100)
			// 	throw new Error(ResponseText.MaxLength('title', 100));
			// handle by validation.
			updateObj.title = title;
		};
		const validateDetails = (details: any) => {
			if (typeof details !== 'string')
				throw new Error(ResponseText.InvalidType('details', 'string'));
			updateObj.details = details;
		};
		const validatePrice = (price: any) => {
			if (isNaN(price))
				throw new Error(ResponseText.InvalidType('price', 'number'));
			if (typeof price === 'string') price = parseInt(price);
			updateObj.price = price;
		};
		const validateDuration = (duration: any) => {
			if (!['string', 'number'].some((x) => typeof duration !== x))
				throw new Error(
					ResponseText.InvalidType('duration', 'string', 'number'),
				);

			updateObj.duration = MS(duration);
		};

		!IsUndefined(title) && validateTitle(title);
		!IsUndefined(details) && validateDetails(details);
		!IsUndefined(price) && validatePrice(price);
		!IsUndefined(duration) && validateDuration(duration);

		return updateObj;
	},
);
PlanSchema.static(
	'createPlan',
	async function (
		data: Omit<PlanData, 'planId'>,
	): Promise<ReturnType<IPlanModel['createPlan']>> {
		const extractedData = await this.extractPlanData(data);

		const plan = await this.create({
			...extractedData,
		});

		return plan;
	},
);
PlanSchema.static(
	'updatePlan',
	async function (
		planId: number,
		data: Partial<PlanData>,
		extraData?: { [key: string]: any },
	): Promise<ReturnType<IPlanModel['updatePlan']>> {
		const plan = await this.getPlan(planId);

		return plan.update(data, extraData);
	},
);
PlanSchema.static(
	'getPlanList',
	async function (
		_limit: number = 20,
		_page: number = 1,
		toLongString: boolean = false,
	): Promise<ReturnType<IPlanModel['getPlanList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

		const totalDocument = await this.countDocuments({});
		const totalPage = Math.ceil(totalDocument / limit);
		let listCheckIn;

		if (page > totalPage) {
			listCheckIn = [];
		} else {
			// Skip and Limit will works like the following:
			// Get array from {skipFromPage} to {limitNext}.
			const limitNext = page * limit;
			const skipFromPage = limitNext - limit;

			const getPlanList = await this.aggregate()
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, __v: 0 })
				.exec();

			listCheckIn = getPlanList;

			if (toLongString) {
				listCheckIn = getPlanList.map((x) => {
					x.duration = MS(x.duration, true);

					return x;
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
PlanSchema.pre('save', async function (next) {
	if (this.isNew) {
		this.planId = await CounterModel.getNextSequence(PlanModel, 'planId');
	}

	next();
});

const PlanModel =
	(mongoose.models.Plan as IPlanModel) ||
	mongoose.model<IPlan, IPlanModel>('Plan', PlanSchema);

export default PlanModel;
