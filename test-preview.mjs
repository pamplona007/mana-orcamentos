// Smoke test: abre /preview e captura screenshot + erros de console.
import { chromium } from 'playwright'
import { setTimeout as sleep } from 'node:timers/promises'

const errors = []
const consoleErrors = []

const browser = await chromium.launch()
const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
const page = await context.newPage()
page.on('console', msg => {
  if (msg.type() === 'error') {
    msg.args().forEach(async (a) => {
      try { consoleErrors.push(await a.jsonValue()) } catch { consoleErrors.push(String(a)) }
    })
  }
})
page.on('pageerror', e => errors.push(String(e)))

console.log('Navigating to /preview ...')
await page.goto('http://127.0.0.1:4188/preview', { waitUntil: 'domcontentloaded', timeout: 30000 })
console.log('DOM loaded, waiting 20s for PDFViewer ...')
await sleep(20000)
await page.screenshot({ path: '/tmp/hbqa/preview-final.png', fullPage: true, timeout: 20000 })
// Try the Baixar PDF button to see what gets downloaded
try {
  const dl = page.waitForEvent('download', { timeout: 8000 })
  await page.click('text="Baixar PDF"')
  const download = await dl
  await download.saveAs('/tmp/hbqa/orcamento-download.pdf')
  console.log('Download saved.')
} catch (e) {
  console.log('Download failed:', e.message)
}
console.log('OK: page loaded, screenshot saved')
console.log('pageerrors:', errors)
console.log('console errors:', consoleErrors.slice(0, 3))
console.log('iframes on page:', await page.locator('iframe').count())
// Check iframe src / blob url
const frame = page.frameLocator('iframe').first()
console.log('iframe content document:', page.title())

// Wait longer and screenshot iframe content separately
await sleep(5000)
const iframeEl = await page.$('iframe')
if (iframeEl) {
  const src = await iframeEl.getAttribute('src')
  console.log('iframe src (first 200 chars):', (src || '').slice(0, 200))
  const frame = await iframeEl.contentFrame()
  if (frame) {
    const html = await frame.evaluate(() => document.body.innerHTML)
    console.log('iframe body length:', html.length)
    console.log('iframe body sample:', html.slice(0, 500))
    // Check if pdf.js has rendered pages
    const pages = await frame.locator('.page').count()
    console.log('pdf.js pages rendered:', pages)
    const bbox = await iframeEl.boundingBox()
    console.log('iframe bbox:', bbox)
  } else {
    console.log('iframe is cross-origin, cannot read content directly')
  }
}

await browser.close()
