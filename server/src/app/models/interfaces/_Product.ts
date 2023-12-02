import { Document, Model, HydratedDocument } from 'mongoose';
import { DocumentList, DocumentResult } from './ExternalDocument';

export interface ProductData {
	productId: number;
	name: string;
	details: string;
	price: number;
	storage: number;
}
export interface IProduct
	extends ProductData,
		DocumentResult<ProductData>,
		Document {}
export interface IProductMethods {
	update(
		data: Partial<ProductData>,
		extractedData?: { [key: string]: any },
	): Promise<ProductHydratedDocument>;
}
export interface IProductModel extends Model<IProduct, {}, IProductMethods> {
	extractProductData(
		data: Partial<Omit<ProductData, 'productId'>>,
	): Promise<Partial<Omit<ProductData, 'productId'>>>;
	getProduct(productId: number): Promise<ProductHydratedDocument>;
	createProduct(
		data: Omit<ProductData, 'productId'>,
	): Promise<ProductHydratedDocument>;
	updateProduct(
		productId: number,
		data: Partial<Omit<ProductData, 'productId'>>,
		extraData?: { [key: string]: any },
	): Promise<ProductHydratedDocument>;
	getProductList(
		limit?: number,
		page?: number,
	): Promise<DocumentList<ProductData>>;
	buyProduct(
		userId: number,
		productId: number,
		quantity: number,
	): Promise<void>;
}
export type ProductHydratedDocument = HydratedDocument<
	IProduct,
	IProductMethods
>;
