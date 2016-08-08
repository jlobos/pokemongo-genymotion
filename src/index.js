
const keypress = require('keypress')
const { random } = require('lodash')
const { join } = require('path')
const { writeFile } = require('jsonfile')
const { star, tick } = require('figures')
const { yellow, green } = require('chalk')

const Genymotion = require('./genymotion')
const { stdin } = process

/**
 * Main
 */

exports.main = (config) => {
  const device = new Genymotion(config)
  const { LEFT, RIGHT, DOWN, UP } = device.options.keys

  // make `process.stdin` begin emitting "keypress" events
  keypress(stdin)

  if (!device.options.location.length) {
    device.emit('get-location', (err, location) => {
      if (err) return console.error(err)
      console.log(` ${yellow(star)} Go! `)
      console.log(` ${green(tick)} Location Updated! latitude: ${location[0]} longitude: ${location[1]}`)
    })
  } else {
    console.log(` ${yellow(star)} Go! `)
  }

  // listen for the "keypress" event
  stdin.on('keypress', (ch, key) => {
    if (key && key.ctrl && key.name === 'c') {
      // save last locations
      writeFile(join(__dirname, '../config.json'), device.options, err => {
        if (err) console.error(err)
        return stdin.pause()
      })
    }

    // handle keypress (up, down, left, right)
    if (key && key.name) handleMove(key.name)
  })

  const handleMove = direction => {
    const move = (direction === UP || direction === DOWN)
    ? random(0.0000700, 0.000500, true)
    : random(0.0001000, 0.000500, true)

    let newLocation
    let { location } = device.options
    switch (direction) {
      case LEFT: { newLocation = [ location[0], location[1] - move ]; break }
      case RIGHT: { newLocation = [ location[0], location[1] + move ]; break }
      case DOWN: { newLocation = [ location[0] - move, location[1] ]; break }
      case UP: { newLocation = [ location[0] + move, location[1] ]; break }
      default: { return }
    }

    device.emit('set-location', newLocation, err => {
      if (err) return console.error(err)
      console.log(` ${green(tick)} Location Updated! latitude: ${newLocation[0]} longitude: ${newLocation[1]}`)
    })
  }

  stdin.setRawMode(true)
  stdin.resume()
}
