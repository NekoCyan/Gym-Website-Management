import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';

export interface MembershipData {
	userId: number;
	planId: number;
	startAt: string;
	endAt: string;
}
export interface IMembership
	extends MembershipData,
		DocumentResult<MembershipData>,
		Document {}
export interface IMembershipMethods {
	updateSubscription(usingTime: number): Promise<MembershipHydratedDocument>;
}
export interface IMembershipVirtuals {
	isExpired: boolean;
}
export interface IMembershipModel
	extends Model<IMembership, {}, IMembershipMethods, IMembershipVirtuals> {
	getMembership(
		userId: number,
		planId: number,
	): Promise<MembershipHydratedDocument>;
	updateMembership(
		userId: number,
		planId: number,
		usingTime: number,
	): Promise<MembershipHydratedDocument>;
	buyMembership(
		userId: number,
		planId: number,
		quantity: number,
	): Promise<void>;
	getMembershipList(
		userId: number,
		limit?: number,
		page?: number,
	): Promise<DocumentList<MembershipHydratedDocument>>;
}
export type MembershipHydratedDocument = HydratedDocument<
	IMembership,
	IMembershipMethods & IMembershipVirtuals
>;
