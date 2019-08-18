# PDFy

HTML to PDF microservice using Chromium's Print to PDF feature.

## Usage

Start the service by running `npm start`. The network interface and port can be changed by the `LISTEN` environment variable, defaults to `127.0.0.1:7111`.

Only `POST` method requests with content type `multipart/form-data` are allowed.

## Form values

### `header`

HTML template for the header. The following classes will be injected:
* `date` formatted date
* `title` document title
* `url` document location
* `pageNumber` current page number
* `totalPages` total pages in the document

### `footer`

HTML template for the footer. Should use the same format as the [`header`](#header).

### `body`

HTML for the main body.

### `format`

Paper format. Takes priority over [`width`](#width%20height) and [`height`](#width%20height) options, defaults to `A4`.

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

### `landscape`

Page orientation, defaults to `false`.

### `width` `height`

Page size.

#### Available units:

* `px` – pixel
* `in` – inch
* `cm` – centimeter
* `mm` – millimeter

### `marginLeft` `marginRight` `marginTop` `marginBottom`

Content margin.

#### Available units:

* `px` – pixel
* `in` – inch
* `cm` – centimeter
* `mm` – millimeter

### `scale`

Scale of page rendering between `0.1` and `2`, defaults to `1`.

### `displayHeaderFooter`

Display header and footer, defaults to `false`.

### `printBackground`

Print background graphics, defaults to `false`.

### `pageRanges`

Pages to print, e.g. `1-5, 8, 11-13`, defaults to ` `.

### `preferCSSPageSize`

Prioritize size declared in CSS' `@page` block, defaults to `false`.
