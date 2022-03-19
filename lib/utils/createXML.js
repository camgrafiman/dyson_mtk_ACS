import { create } from 'xmlbuilder2';
import { promises } from 'fs';
const formatXml = require('xml-formatter');

async function createXML(dataProductsList, nombreCatalogo) {
	const datafeed = {
		root: {
			product: dataProductsList,
		},
	};
	const feed = await create().ele(datafeed);

	feed.end({ prettyPrint: true });

	try {
		await promises.writeFile(
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
