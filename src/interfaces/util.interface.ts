import { Request } from 'express';
import Excel  from 'exceljs';

export interface RequestWithBody extends Request {
	body: { [key: string]: string | undefined};
}
export interface RequestWithParams extends Request {
	params: { [key: string]: string | undefined};
}
export interface RequestWithBodyParams extends Request {
	body: { [key: string]: string | undefined};
	params: { [key: string]: string | undefined};
}
export interface RequestWithDecoded extends Request {
	decoded: string | object
}
export interface Products {
	product: Excel.CellValue,
	unit?: Excel.CellValue, 
	qty: number
};
export type FacilitiesMap = Map<string, Products[]>;