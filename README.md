<p align="center">
  <img src=assets/pikachu.gif>
  <img src=assets/result.gif>
</p>

# Pokémon Go from your [Genymotion](https://www.genymotion.com/) Device

# Installation & Play!

Create a new [Genymotion Device](https://youtu.be/dwIoSGmupWM).

```sh
$ git clone https://github.com/jlobos/pokemongo-genymotion.git
$ cd pokemongo-genymotion
$ npm install
$ npm start
```

# Configuration

Add your perfect settings in the file `config.json`:

```json
{
  "shell": "genymotion-shell",
  "location": [],
  "keys": {
    "UP": "up",
    "DOWN": "down",
    "LEFT": "left",
    "RIGHT": "right"
  }
}
```

* `shell` [Genymotion Shell](https://docs.genymotion.com/Content/04_Tools/Genymotion_Shell/Starting_Genymotion_Shell.htm)
* `location` Initial geolocation.
* `keys` Controls.
