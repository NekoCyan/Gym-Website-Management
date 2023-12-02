import mongoose from 'mongoose';
import {
	IProduct,
	IProductMethods,
	IProductModel,
	ProductData,
} from './interfaces';
import {
	Currency,
	IsUndefined,
	ResponseText,
	TRANSACTION_STATUS,
	TRANSACTION_TYPE,
	ValidateForList,
} from '@/utils';
import CounterModel from './Counter';
import UserModel from './User';
import TransactionModel from './Transaction';

const ProductSchema = new mongoose.Schema<
	IProduct,
	IProductModel,
	IProductMethods
>({
	productId: {
		type: Number,
	},
	name: {
		type: String,
		required: [true, ResponseText.Required('name')],
	},
	details: {
		type: String,
		required: [true, ResponseText.Required('details')],
	},
	price: {
		type: Number,
		required: true,
	},
	storage: {
		type: Number,
		required: true,
		min: [0, ResponseText.Min('storage', 0)],
	},
});

// validation.
ProductSchema.path('name').validate(async function (value: string) {
	const exists = await ProductModel.findOne({ name: value });
	// Avoid duplicated name when update any field.
	if (exists && this.productId === exists.productId) return true;

	return !exists;
}, ResponseText.ProductNameDuplicated);
ProductSchema.path('price').validate(function (value: number) {
	return value > 0;
}, ResponseText.MinOrEqual('price', 0));

// methods.
ProductSchema.method(
	'update',
	async function (
		data: Partial<ProductData>,
		extraData: { [key: string]: any } = {},
	): Promise<ReturnType<IProductMethods['update']>> {
		let updateObj: Partial<ProductData> & {
			[key: string]: any;
		} = {};

		const productData: Partial<ProductData> =
			await ProductModel.extractProductData(data);

		// Group validated fields to update.
		updateObj = { ...productData };
		if (updateObj['storage']) {
			updateObj.storage = this.storage + updateObj.storage;
		}

		// Group extra data to update.
		updateObj = { ...updateObj, ...extraData };

		if (!IsUndefined(extraData.storage) && updateObj.storage! < 0)
			throw new Error(ResponseText.Min('storage', 0));
		if (!IsUndefined(updateObj.storage) && updateObj.storage! < 0)
			throw new Error(
				ResponseText.InvalidDeduction(
					'storage',
					0,
					this.storage,
					productData.storage!,
				),
			);

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
ProductSchema.static(
	'extractProductData',
	async function (
		data: Partial<Omit<ProductData, 'productId'>>,
	): Promise<ReturnType<IProductModel['extractProductData']>> {
		let { name, details, price, storage } = data;
		let updateObj: Partial<ProductData> = {};

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
			if (price < 0) throw new Error(ResponseText.MinOrEqual('price', 0));
			updateObj.price = price;
		};
		const validateStorage = (storage: any) => {
			if (isNaN(storage))
				throw new Error(ResponseText.InvalidType('storage', 'number'));
			if (typeof storage === 'string') storage = parseInt(storage);
			updateObj.storage = storage;
		};

		!IsUndefined(name) && validateName(name);
		!IsUndefined(details) && validateDetails(details);
		!IsUndefined(price) && validatePrice(price);
		!IsUndefined(storage) && validateStorage(storage);

		return updateObj;
	},
);
ProductSchema.static('getProduct', async function (productId: number): Promise<
	ReturnType<IProductModel['getProduct']>
> {
	const product = await this.findOne({ productId });
	if (!product) {
		throw new Error(ResponseText.ProductIdNotFound(productId));
	}

	return product;
});
ProductSchema.static(
	'createProduct',
	async function (
		data: Omit<ProductData, 'productId'>,
	): Promise<ReturnType<IProductModel['createProduct']>> {
		const extractedData = await this.extractProductData(data);

		const product = await this.create({
			...extractedData,
		});

		return product;
	},
);
ProductSchema.static(
	'updateProduct',
	async function (
		productId: number,
		data: Partial<ProductData>,
		extraData?: { [key: string]: any },
	): Promise<ReturnType<IProductModel['updateProduct']>> {
		const product = await this.getProduct(productId);

		return product.update(data, extraData);
	},
);
ProductSchema.static(
	'getProductList',
	async function (
		_limit: number = 20,
		_page: number = 1,
	): Promise<ReturnType<IProductModel['getProductList']>> {
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

			const getProductList = await this.aggregate()
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, __v: 0 })
				.exec();

			listCheckIn = getProductList;
		}

		return {
			list: listCheckIn,
			currentPage: page,
			totalPage,
		};
	},
);
ProductSchema.static(
	'buyProduct',
	async function (
		userId: number,
		productId: number,
		quantity: number,
	): Promise<ReturnType<IProductModel['buyProduct']>> {
		const user = await UserModel.getUser(userId);
		const product = await this.getProduct(productId);

		if (product.storage === 0)
			throw new Error(ResponseText.ProductOutOfStock(product.productId));
		if (product.storage < quantity)
			throw new Error(
				ResponseText.ProductNotEnough(
					product.productId,
					product.storage,
				),
			);
		const totalPrice = product.price * quantity;
		if (user.balance < totalPrice)
			throw new Error(ResponseText.InsufficientBalance);

		let name = `Bought product: ${product.name}.`;
		let details = `Quantity: ${quantity} (Balance from ${Currency(
			user.balance,
		)} to ${Currency(user.balance - totalPrice)}).`;

		await user.decreaseBalance(totalPrice);
		await this.updateProduct(productId, { storage: -quantity });
		await TransactionModel.createTransaction({
			userId: user.userId,
			name,
			details,
			type: TRANSACTION_TYPE.PRODUCT,
			price: product.price,
			quantity: quantity,
			status: TRANSACTION_STATUS.SUCCEED,
		});
	},
);

// middleware.
ProductSchema.pre('save', async function (next) {
	if (this.isNew) {
		this.productId = await CounterModel.getNextSequence(
			ProductModel,
			'productId',
		);
	}

	next();
});
/**
	- Test buy product.
	- Make parameter "type" for request body for transaction to filter.
*/

const ProductModel =
	(mongoose.models.Product as IProductModel) ||
	mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default ProductModel;
