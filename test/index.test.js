import http from 'http'
import test from 'blue-tape'
import winston from 'winston'
import RollbarTransport from '../src'

const rollbarAccessToken = process.env.ROLLBAR_ACCESS_TOKEN

let logger
test('setup', (t) => {
  const transports = [
    new RollbarTransport({ rollbarAccessToken, level: 'info' }),
  ]
  logger = new winston.Logger({ transports })
  t.end()
})

test('message', (t) => {
  logger.info('some message', (err) => {
    t.error(err)
    t.end()
  })
})

test('message with request', (t) => {
  const server = http.createServer((req, res) => {
    logger.info('got a request', { req }, t.error)
    res.end('ok')
  }).listen()
  const { port } = server.address()
  const url = `http://localhost:${port}`
  http.get(url, () => {
    t.end()
    server.close()
  }).on('error', t.error)
})

test('message with other metadata', (t) => {
  logger.info('test custom metadata', {
    somecustomkey: 'somecustomvalue',
  }, (err) => {
    t.error(err)
    t.end()
  })
})

test('message with err metadata', (t) => {
  logger.info('test error logging', {
    err: new Error('just testing error logging'),
    somecustomkey: 'somecustomvalue',
  }, (err) => {
    t.error(err)
    t.end()
  })
})
