// Reads the safe-area variables from the open example.com webview over the DevTools protocol.
// Set ANDROID_SERIAL if more than one device is connected.
import { execSync } from 'node:child_process'

const adb = command => execSync(`adb ${command}`).toString().trim()
// tcp:0 lets adb pick a free port and print it.
const port = adb(`forward tcp:0 localabstract:webview_devtools_remote_${adb('shell pidof com.example.insetrepro')}`)

const pages = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
const page = pages.find(target => target.url.includes('example.com'))
if (!page) {
  console.error('example.com is not open. Tap a button in the app first.')
  process.exit(1)
}

const socket = new WebSocket(page.webSocketDebuggerUrl)
await new Promise(resolve => (socket.onopen = resolve))
const expression = `JSON.stringify({
  devicePixelRatio,
  innerHeight,
  ...Object.fromEntries(['top', 'bottom', 'left', 'right'].map(side => [
    side,
    getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-' + side),
  ])),
})`
socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { expression } }))
const reply = await new Promise(resolve => (socket.onmessage = message => resolve(JSON.parse(message.data))))
console.log(reply.result.result.value)
socket.close()
adb(`forward --remove tcp:${port}`)
