<template>
  <div class="y-imager"></div>
</template>

<script>
import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { MapControls as Controls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { Controls } from './Controls.js'

let blankscene, blankcamera
let renderer1, renderer2
let controls

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

            viewports: [],
            currentViewport: null,
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

        blankcamera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 )
        blankcamera.position.set( 200, 200, 200 )
        
        blankscene = new THREE.Scene()
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

        controls = new Controls( blankcamera, this.$el );
        controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 100;
	controls.maxDistance = 1000;
	controls.maxPolarAngle = Math.PI / 2;

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

            controls.update()
            renderer1.render( this.relscene, this.relcamera )

            if ( this.currentViewport === null ) {
                renderer2.render( blankscene, blankcamera )
            }
            else {
                for ( let viewport in this.currentViewport ) {
                    let left = viewport.rect.left
                    let bottom = viewport.rect.bottom
                    let width = viewport.rect.width
                    let height = viewport.rect.height
                    // renderer2.setViewport( left, bottom, width, height )
                    for ( let scene in viewport.scenes ) {
                        let camera = scene.userData.camera
                        let control = scene.userData.control
                        control.update()
                        renderer2.render( scene, camera )
                    }
                }
            }
        },

        reset () {
            const material = new THREE.MeshBasicMaterial( {
                color: 0x000000,
                wireframe: true,
                wireframeLinewidth: 1,
                side: THREE.DoubleSide
            } )
            
            blankscene.remove.apply( blankscene, blankscene.children )
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
                blankscene.add( object )

                const geometry = new THREE.PlaneBufferGeometry( 100, 100 )
                const mesh = new THREE.Mesh( geometry, material )
                mesh.position.copy( object.position )
                mesh.rotation.copy( object.rotation )
                mesh.scale.copy( object.scale )
                // this.relscene.add( mesh )
            }
        },

        onEventWatch ( view ) {
            let obj = new CSS3DObject( view )
            let camera = new THREE.PerspectiveCamera( 45, this.width / this.height, 1, 1000 )
            let scene = new THREE.Scene()
            scene.userData.camera = camera
            scene.add( obj )
            scene.background = new THREE.Color( 0xf0f0f0 )
            camera.position.set( 0, 0, 800 )
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
