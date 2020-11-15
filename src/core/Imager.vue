<template>
  <div class="y-imager"></div>
</template>

<script>
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { MapControls as Controls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { Controls } from './Controls.js'

let idlescene, idlecamera, idlecontrol
let renderer1, renderer2

export default {
    name: 'CoreImager',

    props: {
        viewsets: Array,
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

    computed: {
        currentViewset () {
            let viewsets = this.viewsets
            for ( let i = 0; i < viewsets.length; i ++ )
                if ( ! viewsets[ i ].inactive )
                    return viewsets[ i ]

            const element = document.createElement( 'div' )
            let viewset = {
                inactive: false,
                element: element,
                image: '',
                scenes: []
            }
            this.$el.appendChild( element )
            viewsets.push.call( viewsets, viewset )
            return viewset
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
        this.$on( 'busy', this.onEventBusy )

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
            TWEEN.update()
            this.render()
        },

        render () {

            if ( this.relscene.visible )
                renderer1.render( this.relscene, this.relcamera )

            if ( idlescene.visible ) {
                idlecontrol.update()
                renderer2.render( idlescene, idlecamera )
            }

            for ( let j = 0; j < this.currentViewset.scenes.length; j ++ ) {
                let scene = this.currentViewset.scenes[ j ]
                scene.userData.control.update()
                scene.userData.renderer.render( scene, scene.userData.camera )
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

            scene.add( v )
            scene.background = new THREE.Color( 0xf0f0f0 )

            let rect = {
                left: 0,
                top: 0,
                width: this.width,
                height: this.height
            }
            let margin = 10
            let d = Math.max( obj.width / ( rect.width / 2 - margin ) * this.width / 2,
                              obj.height / ( rect.height / 2 - margin ) * this.height / 2 )
            camera.position.set( 0, 0, d )

            let renderer = new CSS3DRenderer();
            renderer.setSize( rect.width, rect.height )
            renderer.domElement.style.position = 'absolute'
            renderer.domElement.style.left = rect.left + 'px'
            renderer.domElement.style.top = rect.top + 'px'
            this.currentViewset.element.appendChild( renderer.domElement )

            let control = new Controls( camera, renderer.domElement )
            control.enableDamping = true;
            control.dampingFactor = 0.05;
            control.screenSpacePanning = false;
            control.minDistance = 100;
            control.maxDistance = 1000;
            control.maxPolarAngle = Math.PI / 2;

            scene.userData.camera = camera
            scene.userData.control = control
            scene.userData.renderer = renderer

            this.currentViewset.scenes.push( scene )
        },

        onEventMap ( relations ) {
            this.relations = relations
        },

        onEventBusy ( value ) {
            idlescene.visible =  ! value
            renderer2.domElement.style.display = value ? 'none' : ''
        },
    }
}
</script>

<style>
.y-imager {
    position: relative;
}
</style>
