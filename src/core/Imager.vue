<template>
  <div class="y-imager"></div>
</template>

<script>
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from './CSS3DRenderer.js'
import { MapControls as Controls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { Controls } from './Controls.js'

let idlescene, idlecamera, idlecontrol
let renderer1, renderer2

export default {
    name: 'Imager',
    props: {
        target: Object
    },
    data() {
        return {
            scenes: [],

            relscene: null,
            relcamera: null,

            mapcontrols: null,

            floatscene: null,
            floatcamera: null,
            floatcontrols: null,

            width: 800,
            height: 600,
        }
    },
    mounted() {

        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top

        this.width = width
        this.height = height

        this.relcamera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 )
        this.relcamera.position.set( 200, 200, 200 )

        this.relscene = new THREE.Scene()
        this.relscene.background = new THREE.Color( 0xf0f0f0 )

        idlecamera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 )
        idlecamera.position.set( 200, 200, 200 )

        idlescene = new THREE.Scene()
        this.reset()

        // const axesHelper = new THREE.AxesHelper( 200 );
        // this.relscene.add( axesHelper );

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

        idlecontrol = new Controls( idlecamera, this.$el );
        idlecontrol.enableDamping = true;
        idlecontrol.dampingFactor = 0.05;
        idlecontrol.screenSpacePanning = false;
        idlecontrol.minDistance = 100;
        idlecontrol.maxDistance = 1000;
        idlecontrol.maxPolarAngle = Math.PI / 2;

        this.$on( 'watch', this.onEventWatch )

        this.animate()
    },

    methods: {

        resize ( width, height ) {
            this.width = width
            this.height = height
            this.relcamera.aspect = width / height
            this.relcamera.updateProjectionMatrix()
            renderer1.setSize( width, height )
            renderer2.setSize( width, height )
        },

        animate () {
            requestAnimationFrame( this.animate )

            renderer1.render( this.relscene, this.relcamera )

            for ( let i = 0; i < this.scenes.length; i ++ ) {
                let scene = this.scenes[ i ]
                let v = scene.userData.viewport
                v === null
                    ? renderer2.resetViewport()
                    : renderer2.setViewport( v.left, v.top, v.width, v.height )

                let camera = scene.userData.camera
                let control = scene.userData.control
                control.update()
                renderer2.render( scene, camera )
            }

            if ( ! this.scenes.length ) {
                idlecontrol.update()
                renderer2.resetViewport()
                renderer2.render( idlescene, idlecamera )
            }

        },

        reset () {
            const material = new THREE.MeshBasicMaterial( {
                color: 0x000000,
                wireframe: true,
                wireframeLinewidth: 1,
                side: THREE.DoubleSide
            } )

            idlescene.remove.apply( idlescene, idlescene.children )
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
                idlescene.add( object )

                const geometry = new THREE.PlaneBufferGeometry( 100, 100 )
                const mesh = new THREE.Mesh( geometry, material )
                mesh.position.copy( object.position )
                mesh.rotation.copy( object.rotation )
                mesh.scale.copy( object.scale )
                // this.relscene.add( mesh )
            }
        },

        onEventWatch ( obj ) {
            let v = new CSS3DObject( obj.$el )
            let camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 )
            let scene = new THREE.Scene()
            let control = new Controls( camera, this.$el )

            scene.add( v )
            scene.background = new THREE.Color( 0xf0f0f0 )

            let w = this.width / 2
            let h = this.height
            let margin = 10
            let d = Math.max( obj.width / ( w / 2 - margin ) * this.width / 2,
                              obj.height / ( h / 2 - margin ) * this.height / 2 )
            camera.position.set( 0, 0, d )

            control.enableDamping = true;
            control.dampingFactor = 0.05;
            control.screenSpacePanning = false;
            control.minDistance = 100;
            control.maxDistance = 1000;
            control.maxPolarAngle = Math.PI / 2;

            scene.userData.camera = camera
            scene.userData.control = control
            scene.userData.viewport = {
                left: 0,
                top: 0,
                width: this.width / 2,
                height: this.height
            }

            this.scenes.push( scene )
        },

        onEventMap ( relations ) {
            this.relations = relations
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.y-imager {
    position: relative;
}
</style>