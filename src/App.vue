<template>
  <div id="app">
    <Toolbox></Toolbox>
    <canvas></canvas>
  </div>
</template>

<script>
import Toolbox from './components/Toolbox.vue'
import * as PIXI from 'pixi.js';

export default {
    name: 'App',
    components: {
        Toolbox
    },
    mounted() {
        const app = new PIXI.Application( {
            resizeTo: window,
            view: this.$el.querySelector( 'canvas' )
        } )
        
        // load the texture we need
        app.loader.add('bunny', require('./assets/bunny.png')).load((loader, resources) => {
            // This creates a texture from a 'bunny.png' image
            const bunny = new PIXI.Sprite(resources.bunny.texture)

            // Setup the position of the bunny
            bunny.x = app.renderer.width / 2
            bunny.y = app.renderer.height / 2

            // Rotate around the center
            bunny.anchor.x = 0.5
            bunny.anchor.y = 0.5

            // Add the bunny to the scene we are building
            app.stage.addChild(bunny)

            // Listen for frame updates
            app.ticker.add(() => {
                // each frame we spin the bunny around a bit
                bunny.rotation += 0.01
            })
        })
    },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  position: relative;
  overflow: hidden;
}

html, body {
    padding: 0;
    margin: 0;
    overflow: hidden;
}

</style>
