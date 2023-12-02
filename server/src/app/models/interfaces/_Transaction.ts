import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';

export interface TransactionData {
	transactionId: bigint;
	userId: number;
	name: string;
	details: string;
	type: number;
	price: number;
	quantity: number;
	status: number;
}
export interface ITransaction
	extends TransactionData,
		DocumentResult<TransactionData>,
		Document {}
export interface ITransactionMethods {}
export interface ITransactionVirtuals {
	createdAt: string;
}
export interface ITransactionModel
	extends Model<ITransaction, {}, ITransactionMethods, ITransactionVirtuals> {
	extractTransactionData(
		data: Partial<Omit<TransactionData, 'transactionId'>>,
	): Promise<Partial<Omit<TransactionData, 'transactionId'>>>;
	createTransaction(
		data: Omit<TransactionData, 'transactionId'>,
	): Promise<TransactionHydratedDocument>;
	getTransaction(transactionId: bigint): Promise<TransactionHydratedDocument>;
	getTransactionFromUser(
		transactionId: bigint,
		userId: number,
	): Promise<TransactionHydratedDocument>;
	getTransactionList(
		userId: number,
		limit?: number,
		page?: number,
		type?: number,
	): Promise<DocumentList<TransactionHydratedDocument>>;
	transactionIdToBigInt(transactionParser: {
		low: number;
		high: number;
		unsigned: boolean;
	}): bigint;
}
export type TransactionHydratedDocument = HydratedDocument<
	ITransaction,
	ITransactionMethods & ITransactionVirtuals
>;
