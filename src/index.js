import rollbar from 'rollbar'
import { Transport } from 'winston'

class RollbarTransport extends Transport {
  constructor({
    rollbarAccessToken,
    rollbarConfig,
    level = 'warn',
  } = {}) {
    super()
    if (!rollbarAccessToken) {
      throw new Error('winston-rollbar requires a "rollbarAccessToken" property')
    }

    if (rollbarConfig) {
      rollbar.init(rollbarAccessToken, rollbarConfig)
    } else if (rollbarAccessToken) {
      rollbar.init(rollbarAccessToken)
    }

    this.name = 'rollbar'
    this.level = level
  }

  /**
  * Core logging method exposed to Winston. Metadata is optional.
  * @function log
  * @member Rollbar
  * @param level {string} Level at which to log the message
  * @param msg {string} Message to log
  * @param meta {Object} **Optional** Additional metadata to attach
  * @param callback {function} Continuation to respond to when complete.
  */
  log(level, msg = '', meta = {}, cb) {
    const {
      err: error,
      req,
      ...custom
    } = meta

    const payload = { level, custom }

    if (error && error instanceof Error) {
      rollbar.handleErrorWithPayloadData(error, payload, req, (err) => {
        if (err) return cb(err)
        this.emit('logged')
        cb(null, true)
      })
      return
    }

    rollbar.reportMessageWithPayloadData(msg, payload, req, (err) => {
      if (err) return cb(err)
      this.emit('logged')
      cb(null, true)
    })
  }
}

export default RollbarTransport
