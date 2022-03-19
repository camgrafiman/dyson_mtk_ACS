import cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

async function getProductLists(
	htmldata,
	catalogName,
	options = { country: 'undefined', site: 'undefined', language: '' }
) {
	const $ = cheerio.load(htmldata);

	let localProductsData = [];
	// Ciclo que recorre todas las cajas de producto:
	$('.trade-up-slider__slide').each(function (i, elemento) {
		//console.log(elemento);
		let item = $(elemento);
		let dataLocalProductId = item.attr('data-local-product-id') || '';
		let dataProductId = item.attr('data-product-id') || '';
		let dataCategoryId = item.attr('data-category-id') || '';
		let actionTitle = item.attr('data-analytics-action-title') || '';
		let imgSrc = item
			.find('div.trade-up-item__image > div>picture>img')
			.attr('src')
			.replace('wid=400', 'wid=800');
		let itemName = item.find('h3.trade-up-item__name').text().trim() || '';
		let itemHighlights =
			item.find('p.trade-up-item__highlight').text().trim() || '';
		let starsReader = item.find('div.ratings__stars--reader').text() || '';
		let reviews = item.find('p.ratings__count--trade-up').text() || '';
		let itemTools = item.find('h4.trade-up-item-tools__drop-down-text').text();
		let productPrice = item
			.find('div.trade-up-item__prices>.trade-up-item__compare-row>div')
			.attr('data-product-price');
		let productPriceUnformatted = item
			.find('div.trade-up-item__prices>.trade-up-item__compare-row>div')
			.attr('data-product-price-unformatted');
		let productUrl =
			options.site + item.find('a.trade-up-item__button').attr('href') ||
			options.site;
		let productBadge =
			item.find('span.trade-up-item__badge').text().trim() || '';
		let stock =
			item.find('div.trade-up-item__stock-message').text() || 'In stock';

		localProductsData.push({
			unique_id: uuidv4(),
			catalogName: catalogName,
			productNumber: i,
			type: dataCategoryId,
			country: options.country,
			language: options.language,
			site: options.site,
			dataLocalProductId,
			dataProductId,
			dataCategoryId,
			actionTitle,
			imgSrc,
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
		});
	});
	//console.log(localProductsData);
	return localProductsData;
}

export { getProductLists };
