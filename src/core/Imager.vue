<template>
  <div class="y-imager"></div>
</template>

<script>
import * as THREE from 'three'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { MapControls as Controls } from 'three/examples/jsm/controls/OrbitControls.js'
// import { Controls } from './Controls.js'


let idleScene, idleCamera, idleControl
let renderer1, renderer2


export default {
    name: 'CoreImager',

    props: {
        viewsets: Array,
    },

    data() {
        return {
            relScene: null,
            relCamera: null,

            mapControl: null,

            floatScene: null,
            floatCamera: null,
            floatControl: null,

            width: 800,
            height: 600,
        }
    },

    computed: {
        currentViewset () {
            for ( let i = 0; i < this.viewsets.length; i ++ )
                if ( ! this.viewsets[ i ].inactive )
                    return this.viewsets[ i ]
            return { scenes: [] }
        }
    },

    mounted() {

        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top

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

        idleControl = new Controls( idleCamera, this.$el );
        idleControl.enableDamping = true;
        idleControl.dampingFactor = 0.05;
        idleControl.screenSpacePanning = false;
        idleControl.minDistance = 100;
        idleControl.maxDistance = 1000;
        idleControl.maxPolarAngle = Math.PI / 2;

        this.$on( 'watch', this.onEventWatch )
        this.$on( 'busy', this.onEventBusy )

        this.animate()
    },

    methods: {

        resize ( width, height ) {
            this.width = width
            this.height = height
            this.relCamera.aspect = width / height
            this.relCamera.updateProjectionMatrix()
            renderer1.setSize( width, height )
            renderer2.setSize( width, height )
        },

        animate () {
            requestAnimationFrame( this.animate )
            TWEEN.update()
            this.render()
        },

        render () {

            if ( this.relScene.visible )
                renderer1.render( this.relScene, this.relCamera )

            if ( idleScene.visible ) {
                idleControl.update()
                renderer2.render( idleScene, idleCamera )
            }

            this.currentViewset.scenes.forEach ( scene => {
                scene.userData.control.update()
                scene.userData.renderer.render( scene, scene.userData.camera )
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
            // this.currentViewset.element.appendChild( renderer.domElement )

            let control = new Controls( camera, renderer.domElement )
            control.enableDamping = true;
            control.dampingFactor = 0.05;
            control.screenSpacePanning = false;
            control.minDistance = 100;
            control.maxDistance = 1000;
            control.maxPolarAngle = Math.PI / 2;

            scene.userData.source = obj
            scene.userData.camera = camera
            scene.userData.control = control
            scene.userData.renderer = renderer

            // this.currentViewset.scenes.push( scene )
        },

        onEventMap ( relations ) {
            this.relations = relations
        },

        onEventBusy ( value ) {
            idleScene.visible =  ! value
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
