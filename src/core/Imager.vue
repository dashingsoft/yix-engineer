<template>
  <div class="yix-imager"></div>
</template>

<script>

import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { Controls } from './Controls.js'

let camera, scene, renderer;
let scene2, renderer2;
let controls;


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
        }
    },
    mounted() {

        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top

        camera = new THREE.PerspectiveCamera( 45, width / height, 1, 1000 );
        camera.position.set( 200, 200, 200 );

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
        this.animate()
    },

    methods: {

        resize(width, height) {
            camera.aspect = width / height
            camera.updateProjectionMatrix();
            renderer.setSize( width, height );
            renderer2.setSize( width, height );
        },

        animate() {
            requestAnimationFrame( this.animate );

            controls.update();
            renderer.render( scene, camera );
            renderer2.render( scene2, camera );
        }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.yix-imager {
    position: relative;
}
</style>
