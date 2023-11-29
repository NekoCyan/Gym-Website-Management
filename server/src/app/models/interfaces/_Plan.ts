import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';

export interface PlanData {
	planId: number;
	title: string;
	details: string;
	price: number;
	duration: number;
}
export interface IPlan extends PlanData, DocumentResult<PlanData>, Document {}
export interface IPlanMethods {
	update(
		data: Partial<PlanData>,
		extractedData?: { [key: string]: any },
	): Promise<PlanHydratedDocument>;
}
export interface IPlanModel extends Model<IPlan, {}, IPlanMethods> {
	getPlan(planId: number): Promise<PlanHydratedDocument>;
	extractPlanData(data: Partial<PlanData>): Promise<Partial<PlanData>>;
	createPlan(data: Omit<PlanData, 'planId'>): Promise<PlanHydratedDocument>;
	updatePlan(
		planId: number,
		data: Partial<PlanData>,
		extraData?: { [key: string]: any },
	): ReturnType<IPlanMethods['update']>;
	getPlanList<T extends boolean = false>(
		limit?: number,
		page?: number,
		toLongString?: T,
	): Promise<
		T extends true
			? DocumentList<Omit<PlanData, 'duration'> & { duration: string }>
			: DocumentList<PlanData>
	>;
}
export type PlanHydratedDocument = HydratedDocument<IPlan, IPlanMethods>;
