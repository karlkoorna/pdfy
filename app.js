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
		res.end('(405) Method Not Allowed - Only POST method supported.');
		return;
	}
	
	// Validate content type.
	switch (req.headers['content-type']) {
		case 'multipart/form-data': break;
		default:
			res.statusCode = 400;
			res.end('(400) Bad Request - Only Form Data supported.');
			return;
	}
	
	// Assemble request body and respond with generated PDF file.
	let form = '';
	req.on('data', (chunk) => {
		form += chunk;
	}).on('end', async () => {
		form = querystring.parse(form);
		
		res.setHeader('content-type', 'application/pdf');
		res.setHeader('content-disposition', 'attachment');
		
		const ctx = await browser.createIncognitoBrowserContext();
		const page = await ctx.newPage();
		
		await page.setJavaScriptEnabled(true);
		await page.setContent(form.body);
		
		// Remove used keys.
		delete form.body;
		delete form.path;
		
		// Override default paper format.
		if (!form.format && !form.width && !form.height) form.format = 'A4';
		
		// Transform margin options.
		const margin = {};
		if (form.marginLeft) margin.left = form.marginLeft;
		if (form.marginRight) margin.right = form.marginRight;
		if (form.marginTop) margin.top = form.marginTop;
		if (form.marginBottom) margin.bottom = form.marginBottom;
		form.margin = margin;
		
		res.end(await page.pdf(form));
	});
	
}).listen(...LISTEN.split(':').reverse(), () => {
	console.log(`Listening on ${LISTEN}`);
});
