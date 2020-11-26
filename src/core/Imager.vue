<template>
  <div class="y-imager"></div>
</template>

<script>
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
// import { CSS3DRenderer, CSS3DObject } from './CSS3DRenderer.js'
import { MapControls as Controls } from './Controls.js'

let idleScene, idleCamera
let renderer1, renderer2


export default {
    name: 'CoreImager',

    props: {
        layouts: Array,
        scenes: Array,
    },

    data() {
        return {
            relScene: null,
            relCamera: null,

            overlayLayout: null,

            width: 800,
            height: 600,

            // 当前焦点，相当于观察者的眼睛看到的地方

            // 当前行为的发起者，是一个列表

        }
    },

    computed: {
    },

    mounted() {

        let width = this.width
        let height = this.height

        this.width = width
        this.height = height

        this.relCamera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 )
        this.relCamera.position.set( 200, 200, 200 )

        this.relScene = new THREE.Scene()
        this.relScene.background = new THREE.Color( 0xf0f0f0 )

        idleCamera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 )
        idleCamera.position.set( 200, 200, 200 )

        idleScene = new THREE.Scene()
        this.reset()

        // const axesHelper = new THREE.AxesHelper( 200 );
        // this.relScene.add( axesHelper );

        //
        renderer1 = new THREE.WebGLRenderer( {
            antialias: true,
            } );
        renderer1.setPixelRatio( window.devicePixelRatio );
        renderer1.setSize( width, height );
        this.$el.appendChild( renderer1.domElement );

        renderer2 = new CSS3DRenderer();
        renderer2.setSize( width, height );
        renderer2.domElement.style.position = 'absolute';
        renderer2.domElement.style.top = 0;
        this.$el.appendChild( renderer2.domElement );

        this.animate()
    },

    methods: {

        resize ( width, height ) {
            let aspect = width / height
            this.width = width
            this.height = height
            this.relCamera.aspect = aspect
            this.relCamera.updateProjectionMatrix()
            idleCamera.aspect = aspect
            idleCamera.updateProjectionMatrix()
            renderer1.setSize( width, height )
            renderer2.setSize( width, height )

            // 修改 Layout 里面的所有 viewport
            this.layouts.forEach ( layout => {
                layout.setSize( width, height )
            } )

            this.$el.style.width = width + 'px'
            this.$el.style.height = height + 'px'
            this.render()
        },

        translate ( x, y ) {
            this.$el.style.left = x + 'px'
            this.$el.style.top = y + 'px'
            // this.$el.style.transform = ( x === 0 && y === 0 )
            //     ? 'none'
            //    : 'translate(' + x + 'px, ' + y + 'px)'
        },

        animate () {
            requestAnimationFrame( this.animate )
            TWEEN.update()
            this.render()
        },

        render () {
            if ( this.relScene.visible )
                renderer1.render( this.relScene, this.relCamera )

            if ( idleScene.visible )
                renderer2.render( idleScene, idleCamera )

            this.layouts.forEach( layout => {
                if ( layout.visible )
                    layout.render()
            } )
        },

        reset () {
            const material = new THREE.MeshBasicMaterial( {
                color: 0x000000,
                wireframe: true,
                wireframeLinewidth: 1,
                side: THREE.DoubleSide
            } )

            idleScene.remove.apply( idleScene, idleScene.children )
            for ( let i = 0; i < 10; i ++ ) {
                const element = document.createElement( 'div' )
                element.style.width = '100px'
                element.style.height = '100px'
                element.style.opacity = ( i < 5 ) ? 0.5 : 1
                element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle()

                const object = new CSS3DObject( element )
                object.position.x = Math.random() * 200 - 100
                object.position.y = Math.random() * 200 - 100
                object.position.z = Math.random() * 200 - 100
                object.rotation.x = Math.random()
                object.rotation.y = Math.random()
                object.rotation.z = Math.random()
                object.scale.x = Math.random() + 0.5
                object.scale.y = Math.random() + 0.5
                idleScene.add( object )

                const geometry = new THREE.PlaneBufferGeometry( 100, 100 )
                const mesh = new THREE.Mesh( geometry, material )
                mesh.position.copy( object.position )
                mesh.rotation.copy( object.rotation )
                mesh.scale.copy( object.scale )
                // this.relScene.add( mesh )
            }
        },

        toggleBusy ( value ) {
            if ( value === undefined )
                value = ! idleScene.visible
            idleScene.visible =  value
            renderer2.domElement.style.display = value ? 'none' : ''
        },

        watchObject ( obj, rect ) {
            let scene = obj.scene
            if ( ! rect )
                rect = {
                    left: 0,
                    top: 0,
                    width: this.width,
                    height: this.height
                }
            if ( ! scene )
                scene = this.createObjectScene( obj, rect )
          },

        unwatchObject ( obj ) {
            this.removeObjectScene( obj )
          },

        createObjectScene ( obj, rect ) {
            let width = rect === undefined ? this.width : rect.width
            let height = rect === undefined ? this.height : rect.height
            let camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 )
            let scene = new THREE.Scene()

            scene.add( new CSS3DObject( obj.$el ) )
            scene.background = new THREE.Color( 0xf0f0f0 )

            let margin = 0
            let d = Math.max( obj.width / ( rect.width / 2 - margin ) * this.width / 2,
                              obj.height / ( rect.height / 2 - margin ) * this.height / 2 )
            let d1 = Math.min( obj.width / rect.width * this.width,
                               obj.height / rect.height * this.height )
            let d2 = Math.max( obj.width / rect.width * this.width * 10,
                               obj.height / rect.height * this.height * 10 )
            camera.position.set( 0, 0, d )

            let renderer = new CSS3DRenderer()
            renderer.setSize( rect.width, rect.height )
            renderer.domElement.style.position = 'absolute'
            renderer.domElement.style.left = rect.left + 'px'
            renderer.domElement.style.top = rect.top + 'px'
            this.$el.appendChild( renderer.domElement )

            let control = new Controls( camera, renderer.domElement )
            control.enableDamping = true;
            control.minDistance = d1
            control.maxDistance = d2

            scene.userData.source = obj
            scene.userData.camera = camera
            scene.userData.control = control
            scene.userData.renderer = renderer
            scene.userData.element = renderer.domElement

            obj.scene = scene
            this.scenes.push( scene )

            return scene
        },

        removeObjectScene ( obj ) {
            let scene = obj.scene
            if ( ! obj.scene )
                return

            let index = this.scenes.indexOf( scene )
            if ( index > -1 )
                this.scenes.splice( index, 1 )

            this.layouts.forEach( layout => layout.removeScene( scene ) )

            this.$el.removeChild( scene.element )
            scene.userData.camera.dispose()
            scene.userData.renderer.dispose()
            scene.userData.control.dispose()
            scene.dispose()
        },

        onEventMap ( relations ) {
            this.relations = relations
        },

    }
}
</script>

<style>
.y-imager {
    position: absolute;
    z-index: 2;
}
</style>
