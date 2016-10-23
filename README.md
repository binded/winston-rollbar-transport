# winston-rollbar-transport

[![Build Status](https://travis-ci.org/blockai/winston-rollbar-transport.svg?branch=master)](https://travis-ci.org/blockai/winston-rollbar-transport)

## Install

```bash
npm install --save winston-rollbar-transport winston
```

Requires Node v6+

## Usage

```javascript
import winston from 'winston'
import RollbarTransport from 'winston-rollbar-transport'

const logger = new winston.Logger({
  transports: [
    new RollbarTransport({
      // required
      rollbarAccessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      rollbarConfig: {
        // optional
        // see https://github.com/rollbar/node_rollbar#configuration-reference
      },
      level: 'info', // log level. defaults to 'info'
    }),
  ],
})

// regular logging
logger.info('some message')

// logging with custom metadata
logger.info('some message', {
  // req and err are special keys, see below
  somekey: 'somevalue',
})

// logging with request data
logger.info('some message', { req })

// logging an error
// Important: the second parameter is not optional (see below)
logger.error(err, { err })
```

### Error handling

Since Winston log messages are converted to strings,
`winston-rollbar-transport` will only see a string if `logger.error(new
Error())` is called and can't therefore report the exception propoerly
to Rollbar with `rollbar.handleErrorWithPayloadData`.

Therefore, to correctly report exceptions, use the `err` key on the meta
field in addition to the message. For example:

```javascript
logger.error(err, { err })
```

See [./test](./test) directory for usage examples.