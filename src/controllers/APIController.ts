import { Request, Response, NextFunction } from 'express';
import { get, post, bodyValidator, controller, del, use } from './decorators/index';
import { Products, FacilitiesMap } from '../interfaces';

const testm = (req, res, next)=>{
	console.log('testm');
	next();
}
const testt = (req, res, next)=>{
	console.log('testt', req.body);
	next();
}
@controller('/api')
class APIController {
	@post('/test')
	async sendFile(req: Request, res: Response){
		res.send({ hello: 'world!' });
	}
}
/**
const { file } = req;
	    let fileURL = (file)? file.path: '';
	    console.log(fileURL);
	    try{
			const output = new Excel.Workbook();
			output.creator = 'Me';
			output.lastModifiedBy = 'Me';
			output.modified = new Date();
			output.created = new Date();
			//const workbook = await new Excel.Workbook().xlsx.readFile('./excel.xlsx')//.then((workbook)=>{
			const workbook = await new Excel.Workbook().xlsx.readFile(fileURL);
			const products: Products[] = [];
			const facilities: FacilitiesMap[] = [];
			let lga = '', facility = '', k = 1;
			const lgas = [
			                  'birnin gwari', 'chikun', 'giwa', 'igabi', 'ikara', 'jaba',
			                  'jema a', 'kachia', 'kaduna north', 'kaduna south', 'kagarko',
			                  'kajuru', 'kaura', 'kauru', 'kubau', 'kudan', 'lere', 'makarfi',
			                  'sabon gari', 'sanga', 'soba', 'zangon kataf', 'zaria'
		                 ];
			lgas.map(lga=>{ output.addWorksheet(lga); });
			const addedLgas: string[] = [];
			const lgasMap = new Map<string, FacilitiesMap[]>();
			const facilityMap: FacilitiesMap = new Map<string, Products[]>();
			let startDatanext = false;
			const worksheet = workbook.getWorksheet('LMD ACTUAL AND FOR POD');
			if(!worksheet){
				const data = { success: false, msg: `Please check the sheet name in the file you sent, it should be 'LMD ACTUAL AND FOR POD' no space before or after`}
				return res.statusJson(400, { data: data });
			}
			worksheet.eachRow((row)=>{
			    let i = 0,j = 0;
			    let localProducts: Products[] = [];
			    row.eachCell((cell, colnumber)=>{
			    	let table: Excel.Table;
			    	if(row.getCell('A').toString().toLowerCase() === ' facility profile' && colnumber > 5 && row.getCell('F').toString().toLowerCase() === 'female condom'){
			        	products.push({product: cell.value, unit: '', qty: 0});
			    	}else if(row.getCell('A').toString().toLowerCase() === ' facility profile' && colnumber > 5 && products.length > 0){
				        products[i].unit = cell.value;
				        i++;
				    }
			    	if(row.getCell('S').toString().toLowerCase() === 'quantity supplied'){
			        	startDatanext = true;
			    	}
			    	if(startDatanext){
				        const notFive = ['total', 'facility profile', 'sitename'];
				        if(row.getCell('D').toString().toLowerCase() !== 'total'){
				        	lga = row.getCell('E').toString().toLowerCase();
				        }
				        localProducts = products.map(prod=>{
				        	return {...prod};
				        });
				        if(colnumber === 4 && lgas.includes(lga) && !addedLgas.includes(lga)){
				        	if(!notFive.includes(cell.value.toString().toLowerCase())){
					            facility = cell.value.toString().slice(0, 31);
					            const sheet = output.getWorksheet(lga);
					            table = sheet && sheet.addTable({
					              name: facility,
					              displayName: facility,
					              ref: `A${k+6}`,
					              columns: [
					                {name: 'S/N'},
					                {name: 'PRODUCTS'},
					                {name: 'UNITS'},
					                {name: 'QTY ISSUED'},
					                {name: 'QTY RECEIVED'},
					                {name: 'REMARKS'},
					              ],
					              rows: [],
					              style: {
					                theme: 'TableStyleLight15'
					              }
					            });
					            k = k + products.length + 20;
				        	}
				        	if(cell.value.toString().toLowerCase() === 'total'){
					            const localMap  = new Map(facilityMap);
					            facilityMap.clear();
					            facilities.push(localMap);
					            const localFacilities = facilities.map(facility=> facility);
					            lgasMap.set(lga, [...localFacilities]);

					            facilities.splice(0);
					            addedLgas.push(lga);
					            startDatanext = false;
					            k = 1; j = 0; i = 0;
					            products.splice(0);
					        }
				        }
				        if(colnumber > 5 && facility){
				        	if(facilityMap.get(facility)){
				            	localProducts = facilityMap.get(facility);
				        	}
				        	//@ts-ignore
							localProducts[j].qty = (cell.value.result)? Number.parseInt(cell.value.result) : Number.parseInt(cell.value);
							j++;
							facilityMap.set(facility, [...localProducts]);
				        }
			    	}
			    });
			});

			output.eachSheet(sheet=>{
			    const facilities = lgasMap.get(sheet.name);
			    facilities && facilities.forEach((value)=>{
					let facilityNo = 1;
						value.forEach((products, key)=>{
						const table = sheet.getTable(key);
						if(table){
						  const ref = table.ref;
						  const columnNo = ref.substring(0, 1);
						  const rowNo = ref.substring(1);
						  sheet.getColumn('B').width = 21;
						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)-6}`).value = 'PROOF OF DELIVERY FOR FAMILY PLANNING COMMODITIES';
						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)-6}`).font = { bold: true };
						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)-6}`).alignment = { vertical: 'middle', horizontal: 'center' };
						  sheet.mergeCells(`${columnNo}${Number.parseInt(rowNo)-6}:${'F'}${Number.parseInt(rowNo)-6}`);

						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)-4}`).value = 'Date:';
						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)-4}`).font = { bold: true };
						  sheet.getCell(`${'B'}${Number.parseInt(rowNo)-4}`).value = new Date();
						  sheet.getCell(`${'B'}${Number.parseInt(rowNo)-4}`).font = { bold: true };

						  sheet.getCell(`${'C'}${Number.parseInt(rowNo)-4}`).value = 'POD No.:';
						  sheet.getCell(`${'C'}${Number.parseInt(rowNo)-4}`).font = { bold: true };
						  sheet.getCell(`${'D'}${Number.parseInt(rowNo)-4}`).value = facilityNo++;
						  sheet.getCell(`${'D'}${Number.parseInt(rowNo)-4}`).font = { bold: true };

						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)-2}`).value = 'LGA:';
						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)-2}`).font = { bold: true };
						  sheet.getCell(`${'B'}${Number.parseInt(rowNo)-2}`).value = sheet.name;
						  sheet.getCell(`${'B'}${Number.parseInt(rowNo)-2}`).font = { bold: true };

						  sheet.getCell(`${'C'}${Number.parseInt(rowNo)-2}`).value = 'Facility Name:';
						  sheet.getCell(`${'C'}${Number.parseInt(rowNo)-2}`).font = { bold: true };
						  sheet.getCell(`${'E'}${Number.parseInt(rowNo)-2}`).value = key;
						  sheet.getCell(`${'E'}${Number.parseInt(rowNo)-2}`).font = { bold: true };

						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)+products.length+3}`).value = 'Supplied By:..............................';
						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)+products.length+3}`).font = { bold: true };

						  sheet.getCell(`${'D'}${Number.parseInt(rowNo)+products.length+3}`).value = 'Date:';
						  sheet.getCell(`${'D'}${Number.parseInt(rowNo)+products.length+3}`).font = { bold: true };
						  sheet.getCell(`${'E'}${Number.parseInt(rowNo)+products.length+3}`).value = '..............................';
						  sheet.getCell(`${'E'}${Number.parseInt(rowNo)+products.length+3}`).font = { bold: true };

						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)+products.length+5}`).value = 'Recieved By:..............................';
						  sheet.getCell(`${columnNo}${Number.parseInt(rowNo)+products.length+5}`).font = { bold: true };

						  sheet.getCell(`${'D'}${Number.parseInt(rowNo)+products.length+5}`).value = 'Date:';
						  sheet.getCell(`${'D'}${Number.parseInt(rowNo)+products.length+5}`).font = { bold: true };
						  sheet.getCell(`${'E'}${Number.parseInt(rowNo)+products.length+5}`).value = '..............................';
						  sheet.getCell(`${'E'}${Number.parseInt(rowNo)+products.length+5}`).font = { bold: true };
						  for(let i = 0; i < products.length; i++){
						    table.addRow([i+1, products[i].product, products[i].unit, products[i].qty]);
						  }
						  table.commit();
						}
					});
			    });
			});

			const data = { success: true, url: '' };
    		output.xlsx.writeFile('./uploads/output.xlsx').then(function() {
			    console.log("xls file is written to output.");
			    data.success = true;
			    data.url = './uploads/output.xlsx';
			}).catch(err=>{
			    data.success = false;
			    console.log(err)
			});
	    	setTimeout(()=>{
				return res.statusJson(200, { data: data });
	    	}, 10000);
	    } catch(err){
		    console.log(err);
			return res.statusJson(500, { err });
		}	
*/
