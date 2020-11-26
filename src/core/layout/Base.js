import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from '../CSS3DRenderer.js'
import { MapControls as Controls } from '../Controls.js'


var BaseLayout = function ( width = 800, height = 600, options ) {

    let scope = this
    let fov = options.fov === undefined ? 45 : options.fov
    let near = options.near === undefined ? 1 : options.near
    let far = options.far === undefined ? 10000 : options.far
    let background = options.background === undefined ? 0xf0f0f0 : options.background
    let left = options.left === undefined ? 0 : options.left
    let top = options.top === undefined ? 0 : options.top

    let camera = new THREE.PerspectiveCamera( fov, width / height, near, far )
    let scene = new THREE.Scene()
    let renderer = new CSS3DRenderer()
    scene.background = new THREE.Color( background )

    renderer.setSize( width, height )
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.pointerEvents = 'auto'
    renderer.domElement.style.left = left + 'px'
    renderer.domElement.style.top = top + 'px'
    renderer.domElement.style.display = 'none'

    if ( options.container )
        options.container.appendChild ( renderer.domElement )

    let control = new Controls( camera, renderer.domElement )
    control.enableDamping = true;

    // API
    this.width = width
    this.height = height
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.control = control

    Object.defineProperty( this, 'visible', {
        get() {
            return scene.visible
        },
        set( visible ) {
            scene.visible = visible
            renderer.domElement.style.display = visible ? '' : 'none'
        }
    } )

    this.createObject3D = function ( element, clone ) {
        return new CSS3DObject( clone ? new element.cloneNode ( true ) : element )
    }

    this.moveTo = function ( left, top ) {
        renderer.domElement.style.left = left + 'px'
        renderer.domElement.style.top = top + 'px'
    }

    this.setSize = function ( width, height ) {

        if ( scope.width === width && scope.height === height )
            return

        let aspect = width / height
        camera.aspect = aspect
        camera.updateProjectionMatrix()
        renderer.setSize( width, height )

        scope.width = width
        scope.height = height

    }

    this.render = function () {
        if ( scene.visible ) {
            control.update()
            renderer.render( scene, camera )
        }
    }

    this.clear = function () {
        scene.remove.apply( scene, scene.children )
    }

}

BaseLayout.prototype = Object.create( {} )
BaseLayout.prototype.constructor = BaseLayout

export default BaseLayout
