import express from 'express';
import cors from 'cors';

import { getHTML, getProductosData, dataProductsActual } from './lib/scraper';
import getDB from './lib/lowdatabase';
const db = getDB();

/* Servidor EXPRESS */
const app = express();
app.use(cors());

app.use(express.static('public')); // Sirve recursos desde un directorio público:

/* ENDPOINTS: */

app.get('/', (req, res) => {
	res.send('Inicio app!!!');
});
app.get('/showdata', (req, res, next) => {
	//getData();
	console.log('dataProductsActual: =====');
	console.log(dataProductsActual);
	res.json(dataProductsActual);
});
app.get('/forceScrape', async (req, res, next) => {
	console.log('Re-Scraping.........');
	await go(
		'https://www.decathlon.es/es/browse/c0-mujer/c1-calzado-deportivo/c2-zapatillas-deportivas/_/N-lcz36d?Ndrc=5',
		'zapatillas_deportivas'
	);
	console.log('Hecho.');
});

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

app.listen(5000, () =>
	console.log('El servidor ha iniciado en el puerto 5000')
);

/* FUNCIONES PRINCIPALES */
async function go(url, nombreCatalogo) {
	// Le paso una url y el nombre para que genere el catalogo XML en public:
	let data = await getProductosData(await getHTML(url), nombreCatalogo);
	return data;
}

/* Primer scraping: */
go(
	'https://www.decathlon.es/es/browse/c0-mujer/c1-calzado-deportivo/c2-zapatillas-deportivas/_/N-lcz36d?Ndrc=5',
	'zapatillas_deportivas'
);
go(
	'https://www.decathlon.es/es/browse/c0-mujer/c1-ropa-deportiva/c2-mallas/_/N-1f3scci',
	'mallas_mujer'
);
go(
	'https://www.decathlon.es/es/browse/c0-hombre/c1-calzado-deportivo/c2-nauticos/_/N-1d8q1lr',
	'nauticos_hombre'
);
go(
	'https://www.decathlon.es/es/browse/c0-deportes/c1-ciclismo/_/N-129zvg2',
	'tienda_ciclismo'
);
