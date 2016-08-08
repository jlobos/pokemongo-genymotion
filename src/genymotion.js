
const { parallel, apply } = require('async')
const EventEmitter = require('events')
const { exec } = require('child_process')
const extend = require('deep-extend')

class Genymotion extends EventEmitter {
  constructor (options) {
    super()
    this.options = {
      shell: 'genymotion-shell',
      location: [],
      keys: {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right'
      }
    }

    this.options = extend(this.options, options)

    // handle
    this.on('set-location', this.setLocation)
    this.on('get-location', this.getLocation)
  }

  _shell (command, callback = () => {}) {
    command = command.join(' ')
    exec(`${this.options.shell} -c "${command}"`, (error, stdout, stderr) => {
      callback(error || stderr, stdout)
    })
  }

  _parseLocation (location) {
    let latitude = parseFloat(location[0].replace(',', '.'))
    let longitude = parseFloat(location[1].replace(',', '.'))
    return [ latitude, longitude ]
  }

  getLocation (callback) {
    parallel([
      apply(exec, `${this.options.shell} -c "gps getlatitude"`),
      apply(exec, `${this.options.shell} -c "gps getlongitude"`)
    ], (err, res) => {
      if (err) return callback(err)

      let latitude = /Latitude: (.*)/g.exec(res[0][0])[1]
      let longitude = /Longitude: (.*)/g.exec(res[1][0])[1]

      // update location
      this.options.location = this._parseLocation([ latitude, longitude ])
      callback(err, this.options.location)
    })
  }

  setLocation (location, callback) {
    const newLocation = location.map(loc => loc.toString().replace('.', ','))
    const oldLocation = this.options.location.map(loc => loc.toString().replace('.', ','))

    // update location
    this.options.location = this._parseLocation(newLocation)

    if (oldLocation[0] !== newLocation[0]) {
      this._shell(['gps setlatitude', newLocation[0]], callback)
    } else if (oldLocation[1] !== newLocation[1]) {
      this._shell(['gps setlongitude', newLocation[1]], callback)
    }
  }
}

module.exports = Genymotion
