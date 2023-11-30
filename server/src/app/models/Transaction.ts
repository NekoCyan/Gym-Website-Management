import mongoose, { Schema, Types } from 'mongoose';
import {
	ITransaction,
	ITransactionMethods,
	ITransactionModel,
	TransactionData,
	TransactionHydratedDocument,
} from './interfaces';
import {
	FormatDateTime,
	GenerateSnowflake,
	IsUndefined,
	ResponseText,
	TimestampFromSnowflake,
	ValidateForList,
} from '@/utils';

const TransactionSchema = new mongoose.Schema<
	ITransaction,
	ITransactionModel,
	ITransactionMethods
>({
	transactionId: {
		type: Schema.Types.BigInt,
		unique: true,
	},
	userId: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	details: {
		type: String,
	},
	price: {
		type: Number,
		required: true,
	},
	quantity: {
		type: Number,
		required: true,
	},
	status: {
		type: Number,
		required: true,
	},
});

// validation.

// methods.

// virtuals.
TransactionSchema.virtual('createdAt').get(function () {
	const timestamp = TimestampFromSnowflake(this.transactionId);
	return new Date(timestamp).toISOString();
});

// statics.
TransactionSchema.static(
	'extractTransactionData',
	async function (
		data: Partial<Omit<TransactionData, 'transactionId'>>,
	): Promise<ReturnType<ITransactionModel['extractTransactionData']>> {
		let { userId, name, details, price, quantity, status } = data;
		let updateObj: Partial<Omit<TransactionData, 'transactionId'>> = {};

		const validateUserId = (userId: any) => {
			if (isNaN(userId))
				throw new Error(ResponseText.InvalidType('userId', 'number'));
			if (typeof userId === 'string') userId = parseInt(userId);
			updateObj.userId = userId;
		};
		const validateName = (name: any) => {
			if (typeof name !== 'string')
				throw new Error(ResponseText.InvalidType('name', 'string'));
			updateObj.name = name;
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
		const validateQuantity = (quantity: any) => {
			if (isNaN(quantity))
				throw new Error(ResponseText.InvalidType('quantity', 'number'));
			if (typeof quantity === 'string') quantity = parseInt(quantity);
			if (quantity < 0)
				throw new Error(
					ResponseText.OutOfRange('quantity', 0, Infinity),
				);
			updateObj.quantity = quantity;
		};
		const validateStatus = (status: any) => {
			if (isNaN(status))
				throw new Error(ResponseText.InvalidType('status', 'number'));
			if (typeof status === 'string') status = parseInt(status);
			if (status < 0 || status > 3)
				throw new Error(ResponseText.OutOfRange('status', 0, 3));
			updateObj.status = status;
		};

		!IsUndefined(userId) && validateUserId(userId);
		!IsUndefined(name) && validateName(name);
		!IsUndefined(details) && validateDetails(details);
		!IsUndefined(price) && validatePrice(price);
		!IsUndefined(quantity) && validateQuantity(quantity);
		!IsUndefined(status) && validateStatus(status);

		return updateObj;
	},
);
TransactionSchema.static(
	'transactionIdToBigInt',
	function (transactionParser: {
		low: number;
		high: number;
		unsigned: boolean;
	}): ReturnType<ITransactionModel['transactionIdToBigInt']> {
		return (
			BigInt(transactionParser.low) +
			(BigInt(transactionParser.high) << BigInt(32))
		);
	},
);
TransactionSchema.static(
	'getTransaction',
	async function (
		transactionId: bigint,
	): Promise<ReturnType<ITransactionModel['getTransaction']>> {
		let transaction = await this.findOne({ transactionId }).exec();
		if (!transaction)
			throw new Error(ResponseText.TransactionIdNotFound(transactionId));

		return transaction;
	},
);
TransactionSchema.static(
	'getTransactionFromUser',
	async function (
		transactionId: bigint,
		userId: number,
	): Promise<ReturnType<ITransactionModel['getTransaction']>> {
		let transaction = await this.findOne({
			transactionId,
			userId,
		}).exec();
		if (!transaction)
			throw new Error(ResponseText.TransactionIdNotFound(transactionId));

		return transaction;
	},
);
TransactionSchema.static(
	'createTransaction',
	async function (
		data: Omit<TransactionData, 'transactionId'>,
	): Promise<ReturnType<ITransactionModel['createTransaction']>> {
		const extractTransactionData = await this.extractTransactionData(data);

		const transaction = await this.create({
			...extractTransactionData,
		});

		return transaction;
	},
);
TransactionSchema.static(
	'getTransactionList',
	async function (
		userId: number,
		_limit: number = 20,
		_page: number = 1,
		formatTime: boolean = false,
	): Promise<ReturnType<ITransactionModel['getTransactionList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

		const totalDocument = await this.countDocuments({ userId });
		const totalPage = Math.ceil(totalDocument / limit);
		let listTransaction: TransactionHydratedDocument[];

		if (page > totalPage) {
			listTransaction = [];
		} else {
			// Skip and Limit will works like the following:
			// Get array from {skipFromPage} to {limitNext}.
			const limitNext = page * limit;
			const skipFromPage = limitNext - limit;

			const _getTransactionList = await this.aggregate()
				.match({ userId })
				.sort({ _id: -1 })
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, __v: 0 })
				.exec();
			const getTransactionList = _getTransactionList.map((x) =>
				// This is useful for virtual.
				TransactionModel.hydrate(x),
			);

			listTransaction = getTransactionList.map((x) => {
				if (formatTime) x.createdAt = FormatDateTime(x.createdAt);

				return x;
			});
		}

		return {
			list: listTransaction,
			currentPage: page,
			totalPage,
		};
	},
);

// middleware.
TransactionSchema.pre('save', async function (next) {
	if (this.isNew) {
		this.transactionId = GenerateSnowflake();
	}

	next();
});

const TransactionModel =
	(mongoose.models.Transaction as ITransactionModel) ||
	mongoose.model<ITransaction, ITransactionModel>(
		'Transaction',
		TransactionSchema,
	);

export default TransactionModel;
