import mongoose from 'mongoose';
import {
	IMembership,
	IMembershipMethods,
	IMembershipModel,
	IMembershipVirtuals,
	MembershipHydratedDocument,
} from './interfaces';
import {
	Currency,
	DateToTimestamp,
	FormatFullDateTime,
	ResponseText,
	TRANSACTION,
	ValidateForList,
} from '@/utils';
import UserModel from './User';
import PlanModel from './Plan';
import TransactionModel from './Transaction';

const MembershipSchema = new mongoose.Schema<
	IMembership,
	IMembershipModel,
	IMembershipMethods,
	{},
	IMembershipVirtuals
>({
	userId: {
		type: Number,
		required: true,
	},
	planId: {
		type: Number,
		required: true,
	},
	startAt: {
		type: String,
		default: new Date(0).toISOString(),
	},
	endAt: {
		type: String,
		default: new Date(0).toISOString(),
	},
});

// validation.

// methods.
MembershipSchema.method(
	'updateSubscription',
	async function (
		usingTime: number,
	): Promise<ReturnType<IMembershipMethods['updateSubscription']>> {
		let { endAt } = this;

		const now = Date.now();
		const end = DateToTimestamp(endAt);

		if (this.isExpired) {
			this.startAt = new Date(now).toISOString();
			this.endAt = new Date(now + usingTime).toISOString();
		} else {
			this.endAt = new Date(end + usingTime).toISOString();
		}

		return this.save();
	},
);

// virtuals.
MembershipSchema.virtual('isExpired').get(function () {
	const endAt = DateToTimestamp(this.endAt);

	return Date.now() > endAt;
});

// statics.
MembershipSchema.static(
	'getMembership',
	async function (
		userId: number,
		planId: number,
	): Promise<ReturnType<IMembershipModel['getMembership']>> {
		const plan = await PlanModel.getPlan(planId);
		if (!plan) throw new Error(ResponseText.PlanIdNotFound(planId));

		let getMembership = await this.findOne({ userId, planId }).exec();
		if (!getMembership)
			getMembership = await this.create({ userId, planId });

		return getMembership;
	},
);
MembershipSchema.static(
	'updateMembership',
	async function (
		userId: number,
		planId: number,
		usingTime: number,
	): Promise<ReturnType<IMembershipModel['updateMembership']>> {
		let memberShip = await this.getMembership(userId, planId);

		return memberShip.updateSubscription(usingTime);
	},
);
MembershipSchema.static(
	'buyMembership',
	async function (
		userId: number,
		planId: number,
		quantity: number,
	): Promise<ReturnType<IMembershipModel['buyMembership']>> {
		const user = await UserModel.getUser(userId);
		const plan = await PlanModel.getPlan(planId);

		const totalPrice = plan.price * quantity;
		if (user.balance < totalPrice)
			throw new Error(ResponseText.InsufficientBalance);
		const totalDuration = plan.duration * quantity;

		let name = `Bought membership: ${plan.title}.`;
		let details = `Subscription duration: ${FormatFullDateTime(
			totalDuration,
		)} (Balance from ${Currency(user.balance)} to ${Currency(
			user.balance - totalPrice,
		)}).`;

		await user.decreaseBalance(totalPrice);
		await this.updateMembership(userId, planId, totalDuration);
		await TransactionModel.createTransaction({
			userId: user.userId,
			name,
			details,
			price: plan.price,
			quantity: quantity,
			status: TRANSACTION.SUCCEED,
		});
	},
);
MembershipSchema.static(
	'getMembershipList',
	async function (
		userId: number,
		_limit?: number,
		_page?: number,
	): Promise<ReturnType<IMembershipModel['getMembershipList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

		const totalDocument = await this.countDocuments({});
		const totalPage = Math.ceil(totalDocument / limit);
		let listMembership: MembershipHydratedDocument[];

		if (page > totalPage) {
			listMembership = [];
		} else {
			// Skip and Limit will works like the following:
			// Get array from {skipFromPage} to {limitNext}.
			const limitNext = page * limit;
			const skipFromPage = limitNext - limit;

			const getMembershipList = await this.aggregate()
				.match({ userId })
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, __v: 0 })
				.exec();

			listMembership = getMembershipList.map((x) =>
				// This is useful for virtual.
				MembershipModel.hydrate(x),
			);
		}

		return {
			list: listMembership,
			currentPage: page,
			totalPage,
		};
	},
);

// middleware.

const MembershipModel =
	(mongoose.models.Membership as IMembershipModel) ||
	mongoose.model<IMembership, IMembershipModel>(
		'Membership',
		MembershipSchema,
	);

export default MembershipModel;
