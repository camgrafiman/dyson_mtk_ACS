import cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

async function getProductPage(
	htmldata,
	url,
	options = { country: 'undefined', site: 'undefined', language: '' }
) {
	const $ = cheerio.load(htmldata);

	let localProductData = [];
	// Info de producto:
	let item = $('main');
	let itemProductSpecification = $('div.product-specification__dimensions');
	let boxSection = $('div.whats-in-the-box');

	// Falta por mapear todos estas variables:

	let itemTools = '';

	// FIN Falta por mapear todos estas variables:
	let analyticsObject = JSON.parse(
		item.find('.js-analytics').attr('data-product')
	);
	let categories = checkCategories(analyticsObject.parents);

	let dataLocalProductId =
		item.find('div.product-hero__price--format').attr('data-product-id') || '';
	let reviews = item.find('p.ratings__stars-link').text() || '';
	let starsReader =
		item.find('span.ratings__average-value--product-review').text() || '';

	let itemHighlights =
		item.find('div.product-hero__text-wrapper>p').text().trim() || '';
	let actionTitle =
		item.find('div.product-hero__text-wrapper>h1').text().trim() || '';
	let itemName = analyticsObject.localWebNames.en || '';
	let dataProductId =
		item.find('div.product-hero__price--format').attr('data-product-id') ||
		analyticsObject.globalProductId ||
		'';
	let globalProductId = analyticsObject.globalProductID;
	let localProductSku = analyticsObject.localProductSKU;
	let imgSrc = itemProductSpecification.find('img').attr('data-src');
	let imgSrc2 = boxSection.find('img').attr('data-src');
	let imgDataSrc = item
		.find('div.product-hero__image> div>div>img')
		.attr('data-src');

	let productPrice = item
		.find('div.product-hero__price--format')
		.attr('data-product-price');
	let productPriceUnformatted = item
		.find('div.product-hero__price--format')
		.attr('data-product-price-unformatted');
	let productUrl = url || '';
	let stock =
		item
			.find('div.product-hero__price-container>div:first-child')
			.text()
			.trim() || 'In stock';
	let productBadge =
		item.find('div.product-hero__motif-container>span').text().trim() || '';
	let productImgBadge =
		item.find('div.product-hero__motif-container>img').attr('src') || '';
	let productTitleBadge =
		item.find('div.product-hero__motif-container>img').attr('alt') ||
		analyticsObject.badge.text ||
		'';
	let info =
		item.find('span.sticky-nav__heading-text>button').text().trim() || '';
	let { cat1, cat2, cat3, cat4 } = categories;

	let dataCategoryId = cat1 || '';

	localProductData.push({
		unique_id: uuidv4(),
		catalogName: url,
		productNumber: Math.round(Math.random() * (10000 - 1) + 1),
		type: 'product',
		country: options.country,
		language: options.language,
		site: options.site,
		globalProductId,
		localProductSku,
		dataLocalProductId,
		dataProductId,
		dataCategoryId,
		actionTitle,
		imgSrc,
		imgSrc2,
		imgDataSrc,
		itemName,
		itemHighlights,
		starsReader,
		reviews,
		itemTools,
		productPrice,
		productPriceUnformatted,
		productUrl,
		productBadge,
		stock,
		info,
		productImgBadge,
		productTitleBadge,
		cat1,
		cat2,
		cat3,
		cat4,
	});

	//console.log(localProductData);
	return localProductData;
}

function checkCategories(target) {
	let catObj = {};
	let obj = Object.assign({}, target);

	switch (target.length) {
		case 0:
			catObj = {
				cat1: '',
				cat2: '',
				cat3: '',
				cat4: '',
			};
			break;
		case 1:
			catObj = {
				cat1: obj[0],
				cat2: '',
				cat3: '',
				cat4: '',
			};
			break;
		case 2:
			catObj = {
				cat1: obj[0],
				cat2: obj[1],
				cat3: '',
				cat4: '',
			};
			break;
		case 3:
			catObj = {
				cat1: obj[0],
				cat2: obj[1],
				cat3: obj[2],
				cat4: '',
			};
			break;
		case 4:
			catObj = {
				cat1: obj[0],
				cat2: obj[1],
				cat3: obj[2],
				cat4: obj[3],
			};
			break;
		default:
			catObj = {
				cat1: '',
				cat2: '',
				cat3: '',
				cat4: '',
			};
	}
	return catObj;
}

export { getProductPage };
