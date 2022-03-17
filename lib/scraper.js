import axios from 'axios';
import cheerio from 'cheerio';
import { create } from 'xmlbuilder2';
import { promises as fsPromises } from 'fs';
const formatXml = require('xml-formatter');

async function getHTML(url = '') {
    const {data: html} = await axios.get(url);

    return html; 
}

let dataProductsActual = {};

async function getProductosData(htmldata, nombreCatalogo) {
    const $ = cheerio.load(htmldata);
    //console.log($)
    // console.log('====')
    const productos = $('#js-product-wrapper').children();
    const dktproducts = $('article.dkt-product');
    let dataProducts = [];
    // Ciclo que recorre todas las cajas de producto:
    $('#js-product-wrapper article.dkt-product').each(function (i, elemento) {
        //console.log(elemento);
        let item = $(elemento);
        let dataNature = item.attr('data-nature') || '';
        let dataFamily = item.attr('data-vada-family') || '';
        let dataDepartment = item.attr('data-vada-department') || '';
        let dataSubdepartment = item.attr('data-vada-subdepartment') || '';
        let dataUniverse = item.attr('data-vada-universe') || '';
        let modelId = item.find('div.dkt-product-slider__slide').attr('data-modelid');
        let dataRepositoryId = item.find('div.dkt-product-slider__image').attr('data-product-repository-id') || '';
        let imgSource = item.find('div.dkt-product-slider__image > picture > source:nth-child(5)').attr('srcset');
        let imgJPGConvert = item.find('div.dkt-product-slider__image > picture > source:nth-child(1)').attr('srcset');
        let brand = item.find('span.dkt-product__brand> span').text().trim() || 'no_brand';
        let productUrl = 'https://www.decathlon.es' + item.find('a.dkt-product__title__wrapper').attr('href');
        let title = item.find('h2.dkt-product__title').text().trim();
        let price = item.find('div.dkt-price__cartridge').text().trim().replace('€', '')
        let pricedata = item.find('div.dkt-price__cartridge').attr('data-price');
        let previousPrice = item.find('span.dkt-price__previous-price').text().trim().replace('€', '').replace(',', '.') || '0';
        let reviews = item.find('span.dkt-product__review-count').text().trim() || '(0)';

        
        // console.log('==== Prod ==== ', i)
        // console.log(dataNature)
        // console.log(dataFamily)
        // console.log(modelId)
        // console.log(dataRepositoryId)
        // console.log(brand.trim())
        // console.log(productUrl)
        // console.log(title.trim())
        // console.log(price.trim())
        // console.log(pricedata.trim())
        // console.log(previousPrice)
        // console.log(imgSource)
        // console.log(strImg)

        if (imgJPGConvert !== undefined) {
            imgJPGConvert.replace('webp', 'jpg')
        }

        let rutaImg = imgSource || imgJPGConvert;
        // console.log(rutaImg)


        dataProducts.push({
            'idNumber': i,
            'dataNature': dataNature,
            'dataFamily': dataFamily,
            'dataDepartment': dataDepartment,
            'dataSubdepartment': dataSubdepartment,
            'dataUniverse': dataUniverse,
            'modelId': modelId,
            'dataRepositoryId': dataRepositoryId,
            'imgSource': imgSource,
            'imgJPGConvert': imgJPGConvert,
            'brand': brand,
            'productUrl': productUrl,
            'title': title,
            'price': price,
            'pricedata': pricedata,
            'previousPrice': previousPrice,
            'reviews': reviews
        })

        // console.log('===== Fin prod === ', i)
        
    });

    await createXML(dataProducts, nombreCatalogo);

    console.log(dataProducts);
    dataProductsActual[nombreCatalogo] = dataProducts;
    //return dataProducts;


    
}

async function createXML(dataProductsList, nombreCatalogo) {
    const root = await create({ version: '1.0', encoding: 'UTF-8' })
        .ele('Products');
    // ahora itero sobre la lista de elementos:
    for (let i = 0; i < dataProductsList.length; i++) {
        const producto = root.ele('Product');
        producto.ele('idNumber').txt(dataProductsList[i].idNumber).up()
            .ele('dataNature').txt(dataProductsList[i].dataNature).up()
            .ele('dataFamily').txt(dataProductsList[i].dataFamily).up()
            .ele('dataDepartment').txt(dataProductsList[i].dataDepartment).up()
            .ele('dataSubdepartment').txt(dataProductsList[i].dataSubdepartment).up()
            .ele('dataUniverse').txt(dataProductsList[i].dataUniverse).up()
            .ele('modelId').txt(dataProductsList[i].modelId).up()
            .ele('dataRepositoryId').txt(dataProductsList[i].dataRepositoryId).up()
            .ele('imgSource').txt(dataProductsList[i].imgSource).up()
            .ele('imgJPGConvert').txt(dataProductsList[i].imgJPGConvert).up()
            .ele('brand').txt(dataProductsList[i].brand).up()
            .ele('productUrl').txt(dataProductsList[i].productUrl).up()
            .ele('title').txt(dataProductsList[i].title).up()
            .ele('price').txt(dataProductsList[i].price).up()
            .ele('pricedata').txt(dataProductsList[i].pricedata).up()
            .ele('previousPrice').txt(dataProductsList[i].previousPrice).up()
            .ele('reviews').txt(dataProductsList[i].reviews).up()
            .ele('client').txt('Decathlon').up()
        

    }

    const xml = root.end({ prettyPrint: true });
    
    // console.log(' -------------------- XML ----------------------------------------------------')
    // console.log(xml);
    
    try {
        await fsPromises.writeFile('./public/' + nombreCatalogo + '.xml', formatXml(xml, { collapseContent: true }), 'utf8');
        console.log('EL FICHERO XML HA SIDO ACTUALIZADO.');
    } catch (e) {
        console.error(e, "ERROR a la hora de generar el XML.");
    } finally {
        console.log("ASYNC CreateXML función se ha ejecutado.")
        
    }
}

export {getHTML, getProductosData, dataProductsActual};