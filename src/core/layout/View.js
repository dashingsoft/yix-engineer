import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from '../CSS3DRenderer.js'
import { MapControls as Controls } from '../Controls.js'


var View = function ( domain, options = {} ) {

    let scope = this
    let fov = options.fov === undefined ? 45 : options.fov
    let near = options.near === undefined ? 1 : options.near
    let far = options.far === undefined ? 10000 : options.far
    let background = options.background === undefined ? 0xf0f0f0 : options.background
    let left = options.left === undefined ? 0 : options.left
    let top = options.top === undefined ? 0 : options.top
    let width = options.width === undefined ? 800 : options.width
    let height = options.height === undefined ? 600 : options.height
    let margin = options.margin === undefined ? 0 : options.margin

    let camera = new THREE.PerspectiveCamera( fov, width / height, near, far )
    let scene = new THREE.Scene()
    let renderer = new CSS3DRenderer()
    scene.background = new THREE.Color( background )

    renderer.setSize( width, height )
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.pointerEvents = 'auto'
    renderer.domElement.style.left = left + 'px'
    renderer.domElement.style.top = top + 'px'

    if ( options.container )
        options.container.appendChild ( renderer.domElement )

    // let control = new Controls( camera, renderer.domElement )
    let control = new Controls( camera, options.container )
    control.enableDamping = true;

    // API
    this.width = width
    this.height = height
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.control = control
    this.source = domain

    Object.defineProperty( this, 'visible', {
        get() {
            return scene.visible
        },
        set( visible ) {
            scene.visible = visible
            renderer.domElement.style.display = visible ? '' : 'none'
        }
    } )

    this.moveTo = function ( left, top ) {
        renderer.domElement.style.transform = 'translate(' + left + 'px,' + top + 'px)'
        // renderer.domElement.style.left = left + 'px'
        // renderer.domElement.style.top = top + 'px'
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
        control.update()
        renderer.render( scene, camera )
    }

    this.reset = function () {
        setMainView()
    }

    this.setViewRect = function ( rect, angle ) {
        let target = new THREE.Vector3( rect.left, rect.top, 0 )
        let [ d, d1, d2 ] = calculateDistance( rect.width, rect.height )
        control.reset()

        scene.children.forEach( child => child.position.copy( target ) )
        camera.lookAt( target )
        camera.position.copy( target )
        camera.position.x += d * Math.sin( angle )
        camera.position.z = d * Math.cos( angle )
        control.minDistance = d1
        control.maxDistance = d2
    }

    // Internal function

    function calculateDistance ( vw, vh ) {
        let mx = scope.width * ( scope.width / 2 - margin )
        let my = scope.height * ( scope.height / 2 - margin )
        let d = Math.max( mx / ( vw / 2 - margin), my / ( vh / 2 - margin ) )
        let d1 = Math.min( mx / scope.width, my / scope.height)
        let d2 = Math.max( mx / vw * 4, my / vh * 4 )
        return [d, d1, d2]
    }

    function setMainView () {
        let rect = domain.$el.getBoundingClientRect()
        if ( ! rect.width || ! rect.height ) {
            if ( domain.width && domain.height ) {
                rect.width = domain.width
                rect.height = domain.height
            }
            else {
                rect.width = scope.width
                rect.height = scope.height
            }
        }

        let [ d, d1, d2 ] = calculateDistance( rect.width, rect.height )
        control.reset()

        scene.children.forEach( child => child.position.set( 0, 0, 0 ) )
        camera.lookAt( 0, 0, 0 )
        camera.position.set( 0, 0, d )
        control.minDistance = d1
        control.maxDistance = d2
    }

    scene.add( new CSS3DObject( options.clone ? new domain.$el.cloneNode ( true ) : domain.$el ) )
    setMainView()
}

View.prototype = Object.create( {} )
View.prototype.constructor = View

export default View
