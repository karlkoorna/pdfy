const http = require('http');
const puppeteer = require('puppeteer');
const validate = require('./validate.js');

let browser;
puppeteer.launch().then((_browser) => {
	browser = _browser;
});

http.createServer({
	ServerResponse: class extends http.ServerResponse {
		json(code, type, data) {
			this.statusCode = code;
			this.setHeader('content-type', 'application/json; charset=utf-8');
			this.end(JSON.stringify({ type, data }, null, '\t'));
		}
	}
}, (req, res) => {
	if (req.method !== 'POST') return void res.json(405, 'method');
	if (req.headers['content-type'].split(';')[0] !== 'application/json') return void res.json(405, 'type');
	
	let body = '';
	req.on('data', (chunk) => {
		body += chunk;
	}).on('end', async () => {
		let data;
		try {
			data = JSON.parse(body);
		} catch (ex) {
			return void res.json(400, 'json');
		}
		
		if (!validate(data)) return void res.json(400, 'schema', validate.errors.map((err) => err.dataPath.slice(1) || err.params.missingProperty));
		
		try {
			const page = await (await browser.createIncognitoBrowserContext()).newPage();
			await page.setJavaScriptEnabled(true);
			
			try {
				if (data.body.startsWith('http')) await page.goto(data.body, {
					timeout: data.timeout || 10000,
					waitUntil: {
						'load': 'domcontentloaded',
						'net0': 'networkidle0',
						'net2': 'networkidle2',
					}[data.wait || 'load']
				}); else await page.setContent(data.body);
			} catch (ex) {
				return void res.json(504);
			}
			
			await page.emulateMedia(data.media || 'print');
			const pdf = await page.pdf({
				headerTemplate: data.header ? '<style>#header { display: flex; padding: 0; font-size: 12px; justify-content: center; align-items: center; }</style>' + data.header : '<span></span>',
				footerTemplate: data.footer ? '<style>#footer { display: flex; padding: 0; font-size: 12px; justify-content: center; align-items: center; }</style>' + data.footer : '<span></span>',
				format: data.format == null && data.width == null && data.height == null ? 'A4' : data.format,
				landscape: data.landscape || false,
				width: data.width || 0,
				height: data.height || 0,
				margin: {
					left: data.left || 0,
					right: data.right || 0,
					top: data.top || 0,
					bottom: data.bottom || 0
				},
				scale: data.scale || 1,
				printBackground: data.background || false,
				pageRanges: data.pages || '',
				preferCSSPageSize: data.cssPage || false,
				displayHeaderFooter: Boolean(data.header) || Boolean(data.footer)
			});
			
			res.setHeader('content-type', 'application/pdf');
			res.setHeader('content-disposition', 'attachment');
			res.end(pdf);
		} catch (ex) {
			return void res.json(500, 'pdf', ex.message);
		}
	});
}).listen(...(process.env['LISTEN'] || '127.0.0.1:7111').split(':').reverse());
