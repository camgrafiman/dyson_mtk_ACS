import express from 'express';
import cors from 'cors';

import { getHTML, getProductosData, dataProductsActual } from './lib/scraper';
import { getProductLists } from './lib/scrapper_controllers/productList';
import { getProductPage } from './lib/scrapper_controllers/productPageInfo';
import { createXML } from './lib/utils/createXML';
import getDB from './lib/lowdatabase';
const db = getDB();
const port = 5000;

/* Servidor EXPRESS */
const app = express();
app.use(cors());

app.use(express.static('public')); // Sirve recursos desde un directorio público:

/* ENDPOINTS: */

app.get('/', (req, res) => {
	res.send('Inicio app!!!');
});

// geolocation: https://geolocation.onetrust.com/cookieconsentpub/v1/geo/location

app.get('/dyson_home', async (req, res) => {
	const result = await getHTML('https://www.dyson.co.uk/en');
	// console.log(typeof result);
	// const data = {
	// 	html: JSON.stringify(result),
	// };

	// console.log(data);

	// res.json(data);
	res.send(result);
});

app.get('/dyson/multi', async (req, res) => {
	// Get multiple product info from page lists:
	let hairCareProductList = await getProductLists(
		await getHTML('https://www.dyson.co.uk/hair-care/shop-hair-care'),
		'hair-care',
		{ country: 'uk', site: 'https://www.dyson.co.uk', language: 'en' }
	);

	let vacuumCleanersProductList = await getProductLists(
		await getHTML('https://www.dyson.co.uk/vacuum-cleaners'),
		'vacuum-cleaners',
		{ country: 'uk', site: 'https://www.dyson.co.uk', language: 'en' }
	);

	let airTreatmentProductList = await getProductLists(
		await getHTML('https://www.dyson.co.uk/air-treatment'),
		'air-treatment',
		{ country: 'uk', site: 'https://www.dyson.co.uk', language: 'en' }
	);

	console.log(hairCareProductList);
	console.log(vacuumCleanersProductList);
	console.log(airTreatmentProductList);

	const fullCatalog = hairCareProductList.concat(
		vacuumCleanersProductList,
		airTreatmentProductList
	);
	createXML(fullCatalog, 'dyson-product-datafeed');
	//res.send('VacuumCleaners page');
	res.json(fullCatalog);
});

app.get('/dyson/pdp', async (req, res) => {
	/* Get 1 product page information: */
	let product1 = await getProductPage(
		await getHTML(
			'https://www.dyson.co.uk/air-treatment/purifiers/dyson-purifier-hot-cool/dyson-purifier-hot-cool-white-silver'
		),
		'https://www.dyson.co.uk/air-treatment/purifiers/dyson-purifier-hot-cool/dyson-purifier-hot-cool-white-silver',
		{ country: 'uk', site: 'https://www.dyson.co.uk', language: 'en' }
	);
	createXML(product1, 'dyson-pdp');
	res.json(product1);
});

app.get('/dyson/product/*', async (req, res) => {
	/* Get 1 product page information with url parameter: */
	let urlParam = req.params[0];
	console.log(urlParam);
	// Example: /dyson/product/https://www.dyson.co.uk/hair-care/dyson-airwrap-multi-styler/airwrap-complete-nickel-copper
	let product = await getProductPage(await getHTML(urlParam), urlParam, {
		country: 'uk',
		site: 'https://www.dyson.co.uk',
		language: 'en',
	});
	console.log(product);
	res.json(product);
});

app.get('/dyson_test/multi/:id', async (req, res) => {
	const params = req.params;
	console.log(params);

	res.send('VacuumCleaners page');
});

app.get('/showdata', (req, res, next) => {
	//getData();
	console.log('dataProductsActual: =====');
	console.log(dataProductsActual);
	res.json(dataProductsActual);
});

// app.get('/forceScrape', async (req, res, next) => {
// 	console.log('Re-Scraping.........');
// 	await go(
// 		'https://www.decathlon.es/es/browse/c0-mujer/c1-calzado-deportivo/c2-zapatillas-deportivas/_/N-lcz36d?Ndrc=5',
// 		'zapatillas_deportivas'
// 	);
// 	console.log('Hecho.');
// });

app.get('/insertdata', (req, res, next) => {
	db.insert({ name: 'Bit', student: false, age: 22 }, (err, doc) => {
		console.log('Datos insertados en', doc.name, ' con el id: ', doc._id);
	});
});

app.get('/showinsdata', async (req, res) => {
	const user = await db.findOne({ _id: 'ouylXOsMRuFd2jmi' }, (err, doc) => {
		console.log('Usuario encontrado: ', doc.name);
		console.log(doc);
		// res.json( {
		//    "name": doc.name,
		//    "edad": doc.age,
		//    "estudia": doc.student
		// })
		res.json(doc);
	});
});

app.listen(process.env.PORT || port, () =>
	console.log('El servidor ha iniciado en el puerto 5000')
);
