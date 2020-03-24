# PDFy

HTML to PDF microservice using Chromium's Print to PDF feature.

## Usage

Install dependencies.
```
npm install
```

Start for any environment.
```
npm start
```

The network interface and port can be changed by the `LISTEN` environment variable, which defaults to `127.0.0.1:7111`.

Only `POST` method requests with content type `application/json` are allowed.

## Options

### `header` =  `''`

HTML template for the header.

#### Injected classes:

* `date` – formatted date
* `title` – document title
* `url` – document location
* `pageNumber` – current page number
* `totalPages` – total pages in the document

### `footer` =  `''`

HTML template for the footer. Uses the same format as [`header`](#header).

### `body`

URL or HTML for the page.

### `format` =  `'A4'`

Paper format. Takes priority over [`width`](#width%20height) and [`height`](#width%20height) options.

#### Available formats:

* `Letter` – 216mm x 279mm
* `Legal` – 216mm x 356mm
* `Tabloid` – 279mm x 432mm
* `Ledger` – 432mm x 279mm
* `A0` – 841mm x 1189mm
* `A1` – 594mm x 841mm
* `A2` – 420mm x 594mm
* `A3` – 297mm x 420mm
* `A4` – 210mm x 297mm
* `A5` – 148mm x 210mm
* `A6` – 105mm x 148mm

### `landscape` = `false`

Page orientation.

### `width` `height` = `0`

Page size.

#### Available units:

* `px` – pixel
* `mm` – millimeter
* `cm` – centimeter
* `in` – inch

### `left` `right` `top` `bottom` = `0`

Body margin.

#### Available units:

* `px` – pixel
* `mm` – millimeter
* `cm` – centimeter
* `in` – inch

### `scale` = `1`

Page scale between `.1` and `2`.

### `background` = `false`

Include background graphics.

### `pages` = `''`

Pages to print, e.g. `1-5, 8, 11-13`.

### `cssPage` = `false`

Use size declared in `@page` block.

### `media` = `'print'`

CSS media type of the page.

#### Available values:

* `screen`
* `print`

### `timeout` = `10000`

Page load timeout in ms.

### `wait` = `'load'`

Condition by which to check if the page has loaded.

#### Available values:

* `load` – Wait until the DOMContentLoaded event is fired.
* `net0` – Wait until there are 0 network requests for 500ms.
* `net2` – Wait until there are 0 network requests for 500ms.
