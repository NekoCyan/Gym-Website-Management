import mongoose, { Schema } from 'mongoose';
import {
	ITransaction,
	ITransactionMethods,
	ITransactionModel,
	ITransactionVirtuals,
	TransactionData,
	TransactionHydratedDocument,
} from './interfaces';
import {
	GenerateSnowflake,
	IsUndefined,
	ResponseText,
	TRANSACTION_STATUS,
	TRANSACTION_TYPE,
	TimestampFromSnowflake,
	ValidateForList,
} from '@/utils';

const TransactionSchema = new mongoose.Schema<
	ITransaction,
	ITransactionModel,
	ITransactionMethods,
	{},
	ITransactionVirtuals
>({
	transactionId: {
		type: Schema.Types.BigInt,
		unique: true,
	},
	userId: {
		type: Number,
		required: [true, ResponseText.Required('userId')],
	},
	name: {
		type: String,
		required: [true, ResponseText.Required('name')],
	},
	details: {
		type: String,
	},
	type: {
		type: Number,
		required: [true, ResponseText.Required('type')],
	},
	price: {
		type: Number,
		required: [true, ResponseText.Required('price')],
		min: [0, ResponseText.Min('price', 0)],
	},
	quantity: {
		type: Number,
		required: [true, ResponseText.Required('quantity')],
		min: [1, ResponseText.Min('quantity', 1)],
	},
	status: {
		type: Number,
		required: [true, ResponseText.Required('status')],
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
		let { userId, name, details, type, price, quantity, status } = data;
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
		const validateType = (type: any) => {
			if (isNaN(type))
				throw new Error(ResponseText.InvalidType('type', 'number'));
			if (typeof type === 'string') type = parseInt(type);
			if (
				type < TRANSACTION_TYPE.__MIN! ||
				type > TRANSACTION_TYPE.__MAX!
			)
				throw new Error(
					ResponseText.OutOfRange(
						'type',
						TRANSACTION_TYPE.__MIN!,
						TRANSACTION_TYPE.__MAX!,
					),
				);
			updateObj.type = type;
		};
		const validatePrice = (price: any) => {
			if (isNaN(price))
				throw new Error(ResponseText.InvalidType('price', 'number'));
			if (typeof price === 'string') price = parseInt(price);
			if (price < 0) throw new Error(ResponseText.Min('price', 0));
			updateObj.price = price;
		};
		const validateQuantity = (quantity: any) => {
			if (isNaN(quantity))
				throw new Error(ResponseText.InvalidType('quantity', 'number'));
			if (typeof quantity === 'string') quantity = parseInt(quantity);
			if (quantity < 1) throw new Error(ResponseText.Min('quantity', 1));
			updateObj.quantity = quantity;
		};
		const validateStatus = (status: any) => {
			if (isNaN(status))
				throw new Error(ResponseText.InvalidType('status', 'number'));
			if (typeof status === 'string') status = parseInt(status);
			if (
				status < TRANSACTION_STATUS.__MIN! ||
				status > TRANSACTION_STATUS.__MAX!
			)
				throw new Error(
					ResponseText.OutOfRange(
						'status',
						TRANSACTION_STATUS.__MIN!,
						TRANSACTION_STATUS.__MAX!,
					),
				);
			updateObj.status = status;
		};

		!IsUndefined(userId) && validateUserId(userId);
		!IsUndefined(name) && validateName(name);
		!IsUndefined(details) && validateDetails(details);
		!IsUndefined(type) && validateType(type);
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
		type: number = -1,
	): Promise<ReturnType<ITransactionModel['getTransactionList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

		if (type !== -1 && TRANSACTION_TYPE[type] === undefined)
			throw new Error(
				ResponseText.OutOfRange(
					'type',
					TRANSACTION_TYPE.__MIN!,
					TRANSACTION_TYPE.__MAX!,
				),
			);

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

			let match: { userId: number; type?: number } = { userId };
			if (type !== -1) match = { ...match, type };

			const getTransactionList = await this.aggregate()
				.match(match)
				.sort({ _id: -1 })
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, __v: 0 })
				.exec();

			listTransaction = getTransactionList.map((x) =>
				TransactionModel.hydrate(x),
			);
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
