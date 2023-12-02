import { ResponseText } from '.';

export async function ValidateForList(
	limit: any = 20,
	page: any = 1,
): Promise<{ limit: number; page: number }> {
	if (typeof limit !== 'number')
		throw new Error(ResponseText.InvalidType('limit', 'number'));
	if (limit < 1) throw new Error(ResponseText.InvalidPageNumber(limit));

	if (typeof page !== 'number')
		throw new Error(ResponseText.InvalidType('page', 'number'));
	if (page < 1) throw new Error(ResponseText.InvalidPageNumber(page));

	limit > 100 && (limit = 100);

	return { limit, page };
}
