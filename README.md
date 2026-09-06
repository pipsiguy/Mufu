# EasyDailyReport

A static, no-build, browser-only daily-sales and monthly-inventory tool for small restaurants. Live at [easydailyreport.com](https://easydailyreport.com) (GitHub Pages).

All data lives in the browser's `localStorage`. Nothing is uploaded anywhere. Past weeks and months can be restored from exported PNG snapshots (QR-encoded) or PDF files.

## Pages

- **`index.html`** (`app.js`, `style.css`) — Daily Sales: weekly sales sources, vendor invoices with paid/unpaid toggles, cash expenses, employee hours, cash-on-hand running total, snapshot/PDF/CSV export, bulk QR/PDF re-import, "previous weeks" sidebar.
- **`inventory.html`** (`inventory.js`, `inventory.css`) — Monthly Inventory: categorised item list with prices/units/quantities, monthly invoices (auto-fillable from saved weekly reports), PDF export and round-trip import, CSV export, "previous months" sidebar.

## Languages

English (`en`), Simplified Chinese (`zh`), Spanish (`es`). Switch with the `EN / 中文 / ES` buttons in the header. PDFs embed a CJK-capable font only when the content needs it; Spanish renders with the built-in PDF font.

## Run locally

Open `index.html` in a browser, or use the PowerShell helper, which starts a no-cache `http-server` on `127.0.0.1:4173` (needs Node.js for `npx`):

```powershell
.\start-website.ps1
# or expose to the LAN:
.\start-website.ps1 -Public
```

## Versioning

The version shown in the page footer is hard-coded in `index.html` and `inventory.html`, and the same string is appended as `?v=` to the CSS/JS links so browsers fetch fresh files after a deploy. To release, search both HTML files for the current version and replace every occurrence.

## Storage

| Key                   | Holds                                                                 |
| --------------------- | --------------------------------------------------------------------- |
| `edr_meta`            | Language, last-viewed week, store name, employee/vendor/source/expense row lists. |
| `edr_week_YYYY-MM-DD` | One Monday-anchored week's data (only written once something is entered). |
| `edr_inv_YYYY-MM`     | One month's inventory data, including that month's category/item list. |
| `edr_inv_cfg_v1`      | The category/item catalog used to seed a month that has no data yet.  |

Up to 20 weeks are kept locally; the oldest are auto-evicted when the cap is hit.

## Name rules

Employee, vendor, sales-source, expense and item names may contain any characters except `<`, `>`, `"` and `|` (the last one is used as a delimiter in the QR payload).

## Tests / harnesses

- **`audit_test.html`** — In-browser harness: injects 3 stress weeks (EN/ZH/ES) plus 2 inventory months into `localStorage`, then runs data-integrity, calculation, i18n and edge-case checks. Serve the folder and open it in a browser.
- **`test_daily_data.js`** — Console-paste fixture that populates one dense week for manual UI inspection.
- **`test_pdf_font.html`** — Checks which CJK font CDN URLs load and produces sample PDFs.
- **`inventory_items_price_units.txt`** — The source list the default inventory catalog was built from.

Local-only QR test scripts (`test_qr*.{html,mjs,cjs}`) and their `package.json` are git-ignored.

## Dependencies

Everything loads from CDNs at runtime: Lucide (icons), html2canvas and qrcodejs (PNG snapshot + QR), jsPDF (PDF export), pdf.js (PDF import), zbar-wasm (QR scanning). There is no build step.
