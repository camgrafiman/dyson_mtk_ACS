import { create } from 'xmlbuilder2';
import { promises as fsPromises } from 'fs';
const formatXml = require('xml-formatter');

async function createXML(dataProductsList, nombreCatalogo) {
	const datafeed = {
		root: {
			product: dataProductsList,
		},
	};
	const feed = await create().ele(datafeed);
	// const root = await create({ version: '1.0', encoding: 'UTF-8' }).ele(
	// 	'Products'
	// );
	// // ahora itero sobre la lista de elementos:
	// for (let i = 0; i < dataProductsList.length; i++) {
	// 	const producto = root.ele('Product');
	// 	producto
	// 		.ele('idNumber')
	// 		.txt(dataProductsList[i].idNumber)
	// 		.up()
	// 		.ele('dataNature')
	// 		.txt(dataProductsList[i].dataNature)
	// 		.up()
	// 		.ele('dataFamily')
	// 		.txt(dataProductsList[i].dataFamily)
	// 		.up()
	// 		.ele('dataDepartment')
	// 		.txt(dataProductsList[i].dataDepartment)
	// 		.up()
	// 		.ele('dataSubdepartment')
	// 		.txt(dataProductsList[i].dataSubdepartment)
	// 		.up()
	// 		.ele('dataUniverse')
	// 		.txt(dataProductsList[i].dataUniverse)
	// 		.up()
	// 		.ele('modelId')
	// 		.txt(dataProductsList[i].modelId)
	// 		.up()
	// 		.ele('dataRepositoryId')
	// 		.txt(dataProductsList[i].dataRepositoryId)
	// 		.up()
	// 		.ele('imgSource')
	// 		.txt(dataProductsList[i].imgSource)
	// 		.up()
	// 		.ele('imgJPGConvert')
	// 		.txt(dataProductsList[i].imgJPGConvert)
	// 		.up()
	// 		.ele('brand')
	// 		.txt(dataProductsList[i].brand)
	// 		.up()
	// 		.ele('productUrl')
	// 		.txt(dataProductsList[i].productUrl)
	// 		.up()
	// 		.ele('title')
	// 		.txt(dataProductsList[i].title)
	// 		.up()
	// 		.ele('price')
	// 		.txt(dataProductsList[i].price)
	// 		.up()
	// 		.ele('pricedata')
	// 		.txt(dataProductsList[i].pricedata)
	// 		.up()
	// 		.ele('previousPrice')
	// 		.txt(dataProductsList[i].previousPrice)
	// 		.up()
	// 		.ele('reviews')
	// 		.txt(dataProductsList[i].reviews)
	// 		.up()
	// 		.ele('client')
	// 		.txt('Decathlon')
	// 		.up();
	// }

	feed.end({ prettyPrint: true });
	//const xml = root.end({ prettyPrint: true });

	// console.log(' -------------------- XML ----------------------------------------------------')
	// console.log(xml);

	try {
		await fsPromises.writeFile(
			'./public/feeds/' + nombreCatalogo + '.xml',
			feed,
			// formatXml(feed, { collapseContent: true }),
			'utf8'
		);
		console.log('EL FICHERO XML HA SIDO ACTUALIZADO.');
	} catch (e) {
		console.error(e, 'ERROR a la hora de generar el XML.');
	} finally {
		console.log('ASYNC CreateXML función se ha ejecutado.');
	}
}

export { createXML };
