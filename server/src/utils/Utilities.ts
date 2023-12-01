import { SignJWT, jwtVerify } from 'jose';
import { DateTimeInput, TokenPayload } from '@/Types';
import ms from 'ms';
import { DiscordSnowflake } from '@sapphire/snowflake';

/**
 * @param expiresIn Seconds.
 * @returns
 */
export async function JWT_Sign(payload: TokenPayload, expiresIn: number) {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET is not defined in env.');

	const iat = Math.floor(Date.now() / 1000);
	const exp = iat + expiresIn;

	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
		.setExpirationTime(exp)
		.setIssuedAt(iat)
		.setNotBefore(iat)
		.sign(new TextEncoder().encode(EncodeBase64(secret)));
}

export async function JWT_Verify(token: string) {
	const secret = process.env.JWT_SECRET;
	if (!secret) throw new Error('JWT_SECRET is not defined in env.');

	if (!token) return null;

	try {
		const { payload } = await jwtVerify(
			token,
			new TextEncoder().encode(EncodeBase64(secret)),
		);

		// run some checks on the returned payload, perhaps you expect some specific values

		// if its all good, return it, or perhaps just return a boolean
		return payload as TokenPayload;
	} catch (e) {
		return null;
	}
}

export function EncodeBase64(str: string, depth: number = 1) {
	if (!str || depth <= 0) return str;

	return EncodeBase64(btoa(str), depth - 1);
}

export function DecodeBase64(str: string, depth: number = 1) {
	if (!str || depth <= 0) return str;

	try {
		return DecodeBase64(atob(str), depth - 1);
	} catch (e) {
		return str;
	}
}

export function Capitalize(str: string) {
	if (!str || typeof str !== 'string') return str;

	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function IsUndefined(variable: any): boolean {
	return typeof variable === 'undefined';
}

export function CreateEnum<T extends { [key: string]: number }>(
	keys: T,
): Readonly<T & { [key: number]: keyof T }> {
	const obj: any = {};

	for (const [key, value] of Object.entries(keys)) {
		if (value === null) continue;
		obj[key] = value;
		obj[value] = key;
	}

	return Object.freeze(obj);
}

export function FormatShortDateTime(date: DateTimeInput) {
	if (!date) return '';
	date = new Date(date);

	let result = [];

	let year = date.getFullYear(); // getFullYear() returns the year (four digits for dates between year 1000 and 9999) of the specified date.
	let month = date.getMonth() + 1; // getMonth() is zero-based
	let day = date.getDate(); // getDate() returns the day of the month (from 1 to 31) for the specified date.

	let hours = date.getHours(); // getHours() returns the hour (from 0 to 23) of the specified date and time.
	let minutes = date.getMinutes(); // getMinutes() returns the minutes (from 0 to 59) of the specified date and time.
	let seconds = date.getSeconds(); // getSeconds() returns the seconds (from 0 to 59) of the specified date and time.

	const _0 = PadZero;

	let tt = hours >= 12 ? 'PM' : 'AM'; // AM and PM

	hours = hours % 12;
	hours = hours || 12; // the hour '0' should be '12'

	result.push(`${_0(day)}/${_0(month)}/${year}`);
	result.push(`${_0(hours)}:${_0(minutes)}:${_0(seconds)}`);
	result.push(tt);

	return result.join(' ');
}

// Open AI made this e.e
export function FormatFullDateTime(
	date: Date | string | number,
	long: boolean = false,
): string {
	if (!date) return '';
	date = new Date(date);
	const timestamp = date.getTime();

	const second = 1000;
	const minute = 60 * second;
	const hour = 60 * minute;
	const day = 24 * hour;
	const month = 30 * day;
	const year = 365 * day;

	const years = Math.floor(timestamp / year);
	const months = Math.floor((timestamp % year) / month);
	const days = Math.floor(((timestamp % year) % month) / day);
	const hours = Math.floor((((timestamp % year) % month) % day) / hour);
	const minutes = Math.floor(
		((((timestamp % year) % month) % day) % hour) / minute,
	);
	const seconds = Math.floor(
		(((((timestamp % year) % month) % day) % hour) % minute) / second,
	);

	const plural = (num: number, str: string) => (num > 1 ? `${str}s` : str);
	const formatTime = (time: number, unit: string) =>
		`${time} ${plural(time, unit)}`;

	let timeString = '';

	if (long) {
		timeString += formatTime(years, 'year');
		timeString += ` ${formatTime(months, 'month')}`;
		timeString += ` ${formatTime(days, 'day')}`;
		timeString += ` ${formatTime(hours, 'hour')}`;
		timeString += ` ${PadZero(minutes)} ${plural(minutes, 'minute')}`;
		timeString += ` ${PadZero(seconds)} ${plural(seconds, 'second')}`;
	} else {
		timeString += formatTime(years, 'year');
		timeString += ` ${formatTime(months, 'month')}`;
		if (days > 0 || (years === 0 && months === 0)) {
			timeString += ` ${formatTime(days, 'day')}`;
		}
	}

	return timeString.trim();
}

export function PadZero(number: number) {
	return number < 10 ? `0${number}` : number;
}

export function SearchParamsToObject<T extends { [key: string]: string }>(
	searchParams: URLSearchParams,
): T {
	const obj: any = {};

	for (const [key, value] of searchParams.entries()) {
		obj[key] = value;
	}

	return obj;
}

export function MS<T extends boolean = false>(
	data: string | number,
	toLongString: T = false as T,
): T extends true ? string : number {
	let output: any;

	if (typeof data == 'string') {
		if (!ms(data)) throw new Error(`Invalid time string ${data}.`);
		output = ms(data);
	} else if (typeof data == 'number') {
		output = data;
	} else
		throw new Error(
			`Invalid data type ${typeof data} that was given in data.`,
		);

	if (toLongString) {
		output = ms(output, { long: true });
	}

	return output;
}

export function CommaAnd(
	args: string[],
	Prefix: string = '',
	Postfix: string = '',
): string {
	let arr = Array.from(args);
	if (arr.length == 0) return '';
	const Fix = (text: string) => Prefix + text + Postfix;

	let text = '';
	if (arr.length >= 2) {
		let pop = arr.pop();

		text = arr.map((x) => Fix(x)).join(', ') + ' and ' + Fix(pop!);
	} else {
		text = Fix(arr[0]);
	}
	return text;
}

export function GenerateSnowflake() {
	return DiscordSnowflake.generate();
}

export function TimestampFromSnowflake(id: bigint) {
	return DiscordSnowflake.timestampFrom(id);
}

export function DateToTimestamp(date: Date | string | number) {
	return new Date(date).getTime();
}

export function Currency(data: number) {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(data);
}
