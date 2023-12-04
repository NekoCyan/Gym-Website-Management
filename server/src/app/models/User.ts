import mongoose from 'mongoose';
import {
	IUser,
	IUserMethods,
	IUserModel,
	UserData,
	UserDetails,
	UserHydratedDocument,
} from './interfaces';

import {
	PATTERN,
	JWT_Sign,
	JWT_Verify,
	IsUndefined,
	ResponseText,
	GENDER,
	ROLES,
	ValidateForList,
} from '@/utils';
import { Password_Compare, Password_Hash } from '@/utils/Password';

import CounterModel from './Counter';

const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>({
	userId: {
		type: Number,
		default: 0,
	},
	email: {
		type: String,
		required: [true, ResponseText.Required('email')],
		match: [PATTERN.EMAIL, ResponseText.Invalid('email')],
	},
	password: {
		type: String,
		required: [true, ResponseText.Required('password')],
		minlength: [6, ResponseText.MinLength('password', 6)],
	},

	fullName: {
		type: String,
		default: '',
	},
	gender: {
		type: Number,
		default: -1,
	},
	address: {
		type: String,
		default: '',
	},
	phoneNumber: {
		type: String,
		default: '',
	},
	photo: {
		type: String,
		default: '',
	},

	role: {
		type: Number,
		default: 0,
	},

	balance: {
		type: Number,
		default: 0,
	},
	totalBalance: {
		type: Number,
		default: 0,
	},
});

// validation.
UserSchema.path('email').validate(async function (
	value: any,
): Promise<boolean> {
	if (!this.isNew) return true;
	return (await this.model('User').countDocuments({ email: value })) === 0;
},
ResponseText.AlreadyExists('email'));

// methods.
UserSchema.method(
	'comparePassword',
	async function (password: string): Promise<boolean> {
		return Password_Compare(password, this.password);
	},
);
UserSchema.method(
	'generateAuthToken',
	async function (expiresIn: number = 24 * 60 * 60): Promise<string> {
		return JWT_Sign(
			{
				userId: this.userId,
			},
			expiresIn,
		);
	},
);
UserSchema.method(
	'update',
	async function (
		data: Partial<UserData & UserDetails>,
		extraData: { [key: string]: any } = {},
	): Promise<ReturnType<IUserMethods['update']>> {
		let updateObj: Partial<UserData & UserDetails> & {
			[key: string]: any;
		} = {};

		// UserDetails.
		const userInformations: Partial<UserDetails> =
			await UserModel.extractUserDetails(data);
		// UserData.
		const userData: Partial<UserData> = await UserModel.extractUserData(
			data,
		);

		// Group validated fields to update.
		updateObj = { ...userInformations, ...userData };

		// Custom edit for field.
		if (
			updateObj['password'] &&
			(await this.comparePassword(updateObj.password))
		) {
			throw new Error(ResponseText.OldPasswordSameNew);
		}
		if (updateObj['balance']) {
			if (updateObj.balance > 0)
				updateObj.totalBalance = this.totalBalance + updateObj.balance;
			updateObj.balance = this.balance + updateObj.balance;
		}

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
UserSchema.method('increaseBalance', async function (amount: number): Promise<
	ReturnType<IUserMethods['increaseBalance']>
> {
	return this.update({ balance: amount });
});
UserSchema.method('decreaseBalance', async function (amount: number): Promise<
	ReturnType<IUserMethods['decreaseBalance']>
> {
	return this.update({ balance: -amount });
});

// statics.
UserSchema.static('getUser', async function (userId: number): Promise<
	ReturnType<IUserModel['getUser']>
> {
	const user = await this.findOne({ userId });
	if (!user) throw new Error(ResponseText.UserIdNotFound(userId));

	return user;
});
UserSchema.static(
	'findByCredentials',
	async function (
		email: string,
		password: string,
	): Promise<ReturnType<IUserModel['findByCredentials']>> {
		if (!email) throw new Error(ResponseText.Required('email'));
		if (!password) throw new Error(ResponseText.Required('password'));

		const user = await UserModel.findOne({ email });
		if (!user) throw new Error(ResponseText.NotExists('email'));

		const isPasswordMatch = await user.comparePassword(password);
		if (!isPasswordMatch)
			throw new Error(ResponseText.NotMatch('password'));

		return user;
	},
);
UserSchema.static('findByAuthToken', async function (token: string): Promise<
	ReturnType<IUserModel['findByAuthToken']>
> {
	const verify = await this.decodeAuthToken(token);

	const user = await this.getUser(verify.userId);

	return user;
});
UserSchema.static('decodeAuthToken', async function (token: string): Promise<
	ReturnType<IUserModel['decodeAuthToken']>
> {
	const verify = await JWT_Verify(token);
	if (!verify) throw new Error(ResponseText.Unauthorized);

	return verify;
});
UserSchema.static(
	'extractUserDetails',
	async function (
		data: Partial<UserDetails>,
	): Promise<ReturnType<IUserModel['extractUserDetails']>> {
		let { fullName, gender, address, phoneNumber, photo } = data;
		let updateObj: Partial<UserDetails> = {};

		const validateGender = (gender: any) => {
			if (isNaN(gender))
				throw new Error(ResponseText.InvalidType('gender', 'number'));
			if (typeof gender === 'string') gender = parseInt(gender);
			if (gender < GENDER.__MIN! || gender > GENDER.__MAX!)
				throw new Error(
					ResponseText.OutOfRange(
						'gender',
						GENDER.__MIN!,
						GENDER.__MAX!,
					),
				);
			updateObj.gender = gender;
		};
		const validateFullName = (fullName: any) => {
			if (typeof fullName !== 'string')
				throw new Error(ResponseText.InvalidType('fullName', 'string'));
			updateObj.fullName = fullName;
		};
		const validateAddress = (address: any) => {
			if (typeof address !== 'string')
				throw new Error(ResponseText.InvalidType('address', 'string'));
			updateObj.address = address;
		};
		const validatePhoneNumber = (phoneNumber: any) => {
			if (typeof phoneNumber !== 'string')
				throw new Error(
					ResponseText.InvalidType('phoneNumber', 'string'),
				);
			updateObj.phoneNumber = phoneNumber;
		};
		const validatePhoto = (photo: any) => {
			if (typeof photo !== 'string')
				throw new Error(ResponseText.InvalidType('photo', 'string'));
			updateObj.photo = photo;
		};

		!IsUndefined(gender) && validateGender(gender);
		!IsUndefined(fullName) && validateFullName(fullName);
		!IsUndefined(address) && validateAddress(address);
		!IsUndefined(phoneNumber) && validatePhoneNumber(phoneNumber);
		!IsUndefined(photo) && validatePhoto(photo);

		return updateObj;
	},
);

UserSchema.static(
	'extractUserData',
	async function (
		data: Partial<Omit<UserData, 'userId'>>,
	): Promise<ReturnType<IUserModel['extractUserData']>> {
		let { email, password, role, balance } = data;
		let updateObj: Partial<UserData> = {};

		const validateEmail = (email: any) => {
			if (typeof email !== 'string')
				throw new Error(ResponseText.InvalidType('email', 'string'));
			if (!PATTERN.EMAIL.test(email))
				throw new Error(ResponseText.Invalid('email'));
			updateObj.email = email;
		};
		const validatePassword = (password: any) => {
			if (typeof password !== 'string')
				throw new Error(ResponseText.InvalidType('password', 'string'));
			updateObj.password = password;
		};
		const validateRole = (role: any) => {
			if (isNaN(role))
				throw new Error(ResponseText.InvalidType('role', 'number'));
			if (typeof role === 'string') role = parseInt(role);
			if (role < ROLES.__MIN! || role > ROLES.__MAX!)
				throw new Error(
					ResponseText.OutOfRange('role', ROLES.__MIN!, ROLES.__MAX!),
				);
			updateObj.role = role;
		};
		const validateBalance = (balance: any) => {
			if (isNaN(balance))
				throw new Error(ResponseText.InvalidType('balance', 'number'));
			if (typeof balance === 'string') balance = parseInt(balance);
			updateObj.balance = balance;
		};

		!IsUndefined(email) && validateEmail(email);
		!IsUndefined(password) && validatePassword(password);
		!IsUndefined(role) && validateRole(role);
		!IsUndefined(balance) && validateBalance(balance);

		return updateObj;
	},
);
UserSchema.static(
	'updateUser',
	async function (
		userId: number,
		data: Partial<UserData & UserDetails>,
		extraData: { [key: string]: any },
	): Promise<ReturnType<IUserModel['updateUser']>> {
		const user = await this.getUser(userId);

		return user.update(data, extraData);
	},
);
UserSchema.static(
	'updateBalance',
	async function (
		userId: number,
		amount: number,
	): Promise<ReturnType<IUserModel['updateBalance']>> {
		const user = await this.getUser(userId);

		if (amount >= 0) {
			return user.increaseBalance(amount);
		} else {
			return user.decreaseBalance(-amount);
		}
	},
);
UserSchema.static(
	'getUserList',
	async function (
		_limit: number = 20,
		_page: number = 1,
	): Promise<ReturnType<IUserModel['getUserList']>> {
		const { limit, page } = await ValidateForList(_limit, _page);

		const totalDocument = await this.countDocuments({});
		const totalPage = Math.ceil(totalDocument / limit);
		let listTransaction: UserHydratedDocument[];

		if (page > totalPage) {
			listTransaction = [];
		} else {
			// Skip and Limit will works like the following:
			// Get array from {skipFromPage} to {limitNext}.
			const limitNext = page * limit;
			const skipFromPage = limitNext - limit;

			const getUserList = await this.aggregate()
				.limit(limitNext)
				.skip(skipFromPage)
				.project({ _id: 0, __v: 0, password: 0 })
				.exec();

			listTransaction = getUserList;
		}

		return {
			list: listTransaction,
			currentPage: page,
			totalPage,
		};
	},
);

// middleware.
UserSchema.pre('save', async function (next): Promise<void> {
	const hashPass = async () => {
		this.password = await Password_Hash(this.password);
	};

	if (this.isNew) {
		this.userId = await CounterModel.getNextSequence(UserModel, 'userId');
		await hashPass();
	}

	if (this.isModified('password')) await hashPass();
	if (this.isModified('email')) this.email = this.email.toLowerCase();

	next();
});
UserSchema.pre('validate', function (next): void {
	const passwordLower = this.password.toLowerCase();
	const emailLower = this.email.toLowerCase();
	if (
		[
			emailLower.includes(passwordLower),
			passwordLower.includes(emailLower),
		].some((x) => x === true)
	)
		throw new Error('Password too weak.');

	next();
});

const UserModel =
	(mongoose.models.User as IUserModel) ||
	mongoose.model<IUser, IUserModel>('User', UserSchema);

export default UserModel;
