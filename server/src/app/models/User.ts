import mongoose from 'mongoose';
import { IUser, IUserMethods, IUserModel } from './interfaces';

import { PATTERN, JWT_Sign, JWT_Verify } from '@/utils';
import { Password_Compare, Password_Hash } from '@/utils/Password';

const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>({
	username: {
		type: String,
		required: [true, 'Username is required.'],
		minlength: [5, 'Username cannot be less than 5 characters.'],
		maxlength: [60, 'Username cannot be greater than 60 characters.'],
		match: [PATTERN.USERNAME, 'Username is invalid.'],
	},
	password: {
		type: String,
		required: [true, 'Password is required.'],
		minlength: [6, 'Username cannot be less than 6 characters.'],
	},
	email: {
		type: String,
		required: [true, 'Email is required.'],
		match: [PATTERN.EMAIL, 'Email is invalid.'],
	},

	fullName: {
		type: String,
	},
	address: {
		type: String,
	},
	phoneNumber: {
		type: String,
	},

	role: {
		type: Number,
		default: 0,
	},
});

// Validation.
UserSchema.path('username').validate(async function (value: any) {
	return (await this.model('User').countDocuments({ username: value })) === 0;
}, 'Username already exists');
UserSchema.path('email').validate(async function (value: any) {
	return (await this.model('User').countDocuments({ email: value })) === 0;
}, 'Email already exists');

// methods.
UserSchema.methods.comparePassword = async function (password: string) {
	return await Password_Compare(password, this.password);
};
UserSchema.methods.generateAuthToken = async function (
	expiresIn: number = 24 * 60 * 60,
) {
	return await JWT_Sign(
		{
			username: this.username,
			email: this.email,
		},
		expiresIn,
	);
};

// statics.
UserSchema.statics.findByCredentials = async (
	username: string,
	password: string,
) => {
	if (!username) throw new Error('Username is required.');
	if (!password) throw new Error('Password is required.');

	const user = await UserModel.findOne({ username });
	if (!user) throw new Error('Username is not found.');

	const isPasswordMatch = await user.comparePassword(password);
	if (!isPasswordMatch) throw new Error('Password does not match.');

	return user;
};
UserSchema.statics.findByAuthToken = async (token: string) => {
	const verify = await JWT_Verify(token);
	if (!verify) throw new Error('Unauthorized.');

	const user = await UserModel.findOne({
		username: verify.username,
		email: verify.email,
	});

	return user;
};

// middleware.
UserSchema.pre('save', async function (next) {
	const user = this;

	if (user.isModified('password')) {
		user.password = await Password_Hash(user.password);
	}
	next();
});
UserSchema.pre('validate', function (next) {
	const passwordLower = this.password.toLowerCase();
	const usernameLower = this.username.toLowerCase();
	if (
		[
			usernameLower.includes(passwordLower),
			passwordLower.includes(usernameLower),
		].some((x) => x === true)
	)
		throw new Error('Password too weak.');

	next();
});

const UserModel =
	(mongoose.models.User as IUserModel) ||
	mongoose.model<IUser, IUserModel>('User', UserSchema);

export default UserModel;
