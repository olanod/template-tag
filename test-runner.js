const Puppeteer = require('puppeteer')
const http = require('http')
const fs = require('fs')

const log = (...args) => console.log('\x1b[34m', ...args, '\x1b[0m')
const err = (...args) => console.error('\x1b[31m', ...args, '\x1b[0m')

// serve script as html file over http
let [,,script] = process.argv
if (!script) {
  throw new Error('Missing js file to test')
}
const server = startTestServer(8888)
const {address, port} = server.address()
log('Serving', `"${script}" in [${address}]:${port}`)

// launch chrome and test file
testInBrowser(`http://[${address}]:${8888}`)

async function testInBrowser(serverUrl){
  const browser = await Puppeteer.launch({args: ['--no-sandbox']})
  const finish = errorMsg => {
    browser.close()
    server.close()
    if (errorMsg) err('😞', errorMsg)
    else log('👌')
    process.exit(errorMsg ? 1 : 0)
  }
  try {
    const page = await browser.newPage()
    page.on('error', finish)
    page.on('pageerror', finish)
    page.on('console', log)
    log(`Opening ${serverUrl}`)
    await page.goto(serverUrl)
    finish()
  } catch (e) {
    finish(e)
  }
}

function startTestServer(port) {
  const server = http.createServer((req, res) => {
    if (req.url === '/') {
      res.write(`<script type="module">${fs.readFileSync(script)}</script>`)
    } else if (req.url.endsWith('.js')) {
      res.writeHead(200, {'Content-Type': 'text/javascript'})
      res.write(fs.readFileSync(`.${req.url}`))
    } else {
      res.writeHead(404)
    }
    res.end()
  })
  server.listen(port)
  return server
}
