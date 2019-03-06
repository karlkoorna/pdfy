const http = require('http');
const querystring = require('querystring');
const puppeteer = require('puppeteer');

const LISTEN = process.env['LISTEN'] || '127.0.0.1:7111';

// Launch browser process.
let browser;
puppeteer.launch().then((_browser) => {
	browser = _browser;
});

// Create HTTP server and start listening.
http.createServer((req, res) => {
	res.setHeader('content-type', 'text/plain; charset=utf-8');
	
	// Validate request method.
	if (req.method !== 'POST') {
		res.statusCode = 405;
		res.end('(405) Method Not Allowed - Only POST method allowed.');
		return;
	}
	
	// Validate request content type.
	if (req.headers['content-type'] !== 'multipart/form-data') {
		res.statusCode = 400;
		res.end('(400) Bad Request - Only Multipart Form Data allowed.');
		return;
	}
	
	// Assemble request body and respond with generated PDF file.
	let data = '';
	req.on('data', (chunk) => {
		data += chunk;
	}).on('end', async () => {
		try {
			const form = querystring.parse(data);
			const ctx = await browser.createIncognitoBrowserContext();
			const page = await ctx.newPage();
			
			await page.setJavaScriptEnabled(true);
			await page.setContent(form.body);
			
			// Transform header and footer options.
			form.headerTemplate = form.header;
			form.footerTemplate = form.footer;
			
			// Override default paper format.
			if (!form.format && !form.width && !form.height) form.format = 'A4';
			
			// Transform margin options.
			const margin = {};
			if (form.marginLeft) margin.left = form.marginLeft;
			if (form.marginRight) margin.right = form.marginRight;
			if (form.marginTop) margin.top = form.marginTop;
			if (form.marginBottom) margin.bottom = form.marginBottom;
			form.margin = margin;
			
			// Prevent saving file on server.
			delete form.path;
			
			res.setHeader('content-type', 'application/pdf');
			res.setHeader('content-disposition', 'attachment');
			res.end(await page.pdf(form));
		} catch (ex) {
			res.statusCode = 500;
			res.end(`(500) Internal Server Error - ${ex.message}`);
		}
	});
}).listen(...LISTEN.split(':').reverse(), () => {
	console.log(`Listening on ${LISTEN}`);
});
