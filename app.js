
const { Image } = require('ascii-art')
const { join } = require('path')
const { main } = require('./src/index')
const config = require('./config.json')

const pikachu = new Image({
  width: 60,
  filepath: join(__dirname, 'assets/pikachu.png'),
  alphabet: 'variant4'
})

pikachu.write((err, rendered) => {
  if (err) return console.error(err)
  console.log(rendered)

  main(config)
})

