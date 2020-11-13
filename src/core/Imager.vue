<template>
  <div class="yix-imager"></div>
</template>

<script>

import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
// import { Controls } from './Controls.js'
import { MapControls as Controls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer
let scene2, renderer2
let controls

export default {
    name: 'Imager',
    props: {
        target: Object
    },
    data() {
        return {
            scene: null,
            camera: null,
            renderer: null,
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

        camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
        camera.position.set( 200, 200, 200 );
        // camera.position.set( 400, 200, 0 );
        
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xf0f0f0 );

        scene2 = new THREE.Scene();
        const material = new THREE.MeshBasicMaterial( {
            color: 0x000000,
            wireframe: true,
            wireframeLinewidth: 1,
            side: THREE.DoubleSide
        } );

        for ( let i = 0; i < 10; i ++ ) {

            const element = document.createElement( 'div' );
            element.style.width = '100px';
            element.style.height = '100px';
            element.style.opacity = ( i < 5 ) ? 0.5 : 1;
            element.style.background = new THREE.Color( Math.random() * 0xffffff ).getStyle();

            const object = new CSS3DObject( element );
            object.position.x = Math.random() * 200 - 100;
            object.position.y = Math.random() * 200 - 100;
            object.position.z = Math.random() * 200 - 100;
            object.rotation.x = Math.random();
            object.rotation.y = Math.random();
            object.rotation.z = Math.random();
            object.scale.x = Math.random() + 0.5;
            object.scale.y = Math.random() + 0.5;
            scene2.add( object );

            const geometry = new THREE.PlaneBufferGeometry( 100, 100 );
            const mesh = new THREE.Mesh( geometry, material );
            mesh.position.copy( object.position );
            mesh.rotation.copy( object.rotation );
            mesh.scale.copy( object.scale );
            // scene.add( mesh );

        }

        // const axesHelper = new THREE.AxesHelper( 200 );
        // scene.add( axesHelper );

        //
        renderer = new THREE.WebGLRenderer( {
            antialias: true,
            } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( width, height );
        this.$el.appendChild( renderer.domElement );

        renderer2 = new CSS3DRenderer();
        renderer2.setSize( width, height );
        renderer2.domElement.style.position = 'absolute';
        renderer2.domElement.style.top = 0;
        this.$el.appendChild( renderer2.domElement );

        controls = new Controls( camera, this.$el );
        controls.enableDamping = true;
	controls.dampingFactor = 0.05;
	controls.screenSpacePanning = false;
	controls.minDistance = 100;
	controls.maxDistance = 1000;
	controls.maxPolarAngle = Math.PI / 2;

        this.animate()

        this.$on( 'view', this.onEventView )
    },

    methods: {

        resize ( width, height ) {
            this.width = width
            this.height = height
            camera.aspect = width / height
            camera.updateProjectionMatrix();
            renderer.setSize( width, height );
            renderer2.setSize( width, height );
        },

        animate () {
            requestAnimationFrame( this.animate );
            controls.update();
            renderer.render( scene, camera );
            renderer2.render( scene2, camera );
        },

        onEventView ( view ) {
            let obj = new CSS3DObject( view )
            scene2.remove.apply( scene2, scene2.children )
            scene2.add( obj )
            camera.position.set( 0, 0, 800 );
        },

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yix-imager {
    position: relative;
}
</style>
