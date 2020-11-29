import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from '../CSS3DRenderer.js'
import { MapControls as Controls } from '../Controls.js'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'


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
    renderer.domElement.style.pointerEvents = 'none'
    renderer.domElement.style.left = left + 'px'
    renderer.domElement.style.top = top + 'px'

    if ( options.container )
        options.container.appendChild ( renderer.domElement )

    // let control = new Controls( camera, renderer.domElement )
    let control = new Controls( camera, options.container )
    control.enableDamping = true;

    let violateContainer = document.createElement( 'div' )
    document.body.appendChild( violateContainer )

    // API
    this.width = width
    this.height = height
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.control = control
    this.source = domain

    this.left = left
    this.top = top

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
        scope.left = left
        scope.top = top
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
        control.enabled = true
        setMainView()
    }

    this.setViewRect = function ( vwidth, vheight, angle ) {
        let target = new THREE.Vector3( 0, 0, 0 )
        let [ w, h ] = getObjectSize()
        let [ d, d1, d2 ] = getDistanceRange( w, h, vwidth, vheight )
        control.reset()

        scene.children.forEach( child => child.position.copy( target ) )
        camera.lookAt( target )
        camera.position.copy( target )
        camera.position.x += d * Math.sin( angle )
        camera.position.z = d * Math.cos( angle )
        control.minDistance = d1
        control.maxDistance = d2
    }

    this.createTweenApart = function ( refitem, duration = 3000 ) {
        let element = scope.renderer.domElement
        let transform = element.style.transform

        return new TWEEN.Tween( {
            scale: 0.01,
            left: refitem.left,
            top: refitem.top
        } ).to( {
            scale: 1.0,
            left: scope.left,
            top: scope.top
        }, duration )
            .onStart( () => {
                scope.visible = true
                control.enabled = false
            } )
            .onComplete( () => {
                element.style.transform = transform
                control.enabled = true
            } )
            .onUpdate( object => {
                element.style.transform = 'translate(' + object.left + 'px, ' + object.top + 'px)' +
                    ' scale(' + object.scale + ')'
                console.log( element.style.transform )
            } )
    }

    this.createTweenFlowIn = function ( refel, duration = 2000 ) {
        let el = scene.children[ 0 ].element
        let refrect = getScreenRect( refel )
        let rect = getScreenRect( el )
        if ( refrect === undefined || rect === undefined ) {
            console.log('无法得到位置信息')
                        return
        }

        console.log( 'Got rect:' + JSON.stringify( rect ) )
        console.log( 'Got refrect:' + JSON.stringify( refrect ) )

        let [ w, h ] = getObjectSize()
        h = Math.min( h, scope.height )
        w = Math.min( w, scope.width )
        // let sx = refrect.width / w, sy = refrect.height / h
        let tempElement = el.cloneNode( true )
        tempElement.style.position = 'absolute'
        tempElement.style.left = refrect.left + 'px'
        tempElement.style.top = refrect.top + 'px'
        tempElement.style.opacity = 0
        tempElement.style.transform = 'none'
        tempElement.style.transformOrigin = 'top left'
        tempElement.style.zIndex = 90
        violateContainer.appendChild( tempElement )
        renderer.domElement.style.opacity = 0

        return new TWEEN.Tween( {
            left: 0,
            top: 0,
            sx: refrect.width / w,
            sy: refrect.height / h,
        } ).to( {
            left: rect.left - refrect.left,
            top: rect.top - refrect.top,
            sx: rect.width / w,
            sy: rect.height / h,
        }, duration )
            .onStart( () => {
                tempElement.style.opacity = 1
                control.enabled = false
            } )
            .onComplete( () => {
                renderer.domElement.style.opacity = 1
                violateContainer.removeChild( tempElement )
                control.enabled = true
            } )
            .onUpdate( object => {
                console.log( object.left, object.top, object.sx, object.sy )
                tempElement.style.transform =
                    'translate(' + object.left + 'px, ' + object.top + 'px) '
                     + 'scale(' + object.sx + ',' + object.sy + ')'
            } )
    }

    // Internal function

    // function calculatePosition( distance, angle, horizion = true ) {
    //     const quaternion = new THREE.Quaternion();
    //     const axis = horizion ? new THREE.Vector3( 0, 1, 0 ) : new THREE.Vector3( 1, 0, 0 )
    //     quaternion.setFromAxisAngle( axis, angle )
    //     const pos = new THREE.Vector3( 0, 0, 1 )
    //     pos.applyQuaternion( quaternion )
    //     pos.setLength( distance )
    //     return pos
    // }

    function calculateDistance ( width, height, vwidth, vheight ) {
        let mx = scope.width / ( vwidth / 2 - margin )
        let my = scope.height / ( vheight / 2 - margin )
        return Math.max( mx * ( width / 2 - margin), my * ( height / 2 - margin ) )
    }

    function getObjectSize() {
        let rect = domain.$el.getBoundingClientRect()
        return [ domain.width ? domain.width : rect.width ? rect.width : scope.width,
                 domain.height ? domain.height : rect.height ? rect.height : scope.height ]
    }

    function getDistanceRange ( width, height, vwidth, vheight ) {
        let d = calculateDistance( width / .9, height / .9, vwidth, vheight )
        let d1 = calculateDistance( width, height, vwidth, vheight )
        let d2 = calculateDistance(  width * 4, height * 4, vwidth, vheight )
        return [d, d1, d2]
    }

    function setMainView () {
        let [ w, h ] = getObjectSize()
        let [ d, d1, d2 ] = getDistanceRange( w, h, scope.width, scope.height )
        control.reset()

        scene.children.forEach( child => child.position.set( 0, 0, 0 ) )
        camera.lookAt( 0, 0, 0 )
        camera.position.set( 0, 0, d )
        control.minDistance = d1
        control.maxDistance = d2
    }

    // function debugShowRect( rect, color ) {
    //     var tableRectDiv = document.createElement('div');
    //     tableRectDiv.className = 'i-violate'
    //     tableRectDiv.style.position = 'absolute';
    //     tableRectDiv.style.zIndex = 99;
    //     tableRectDiv.style.border = '1px solid ' + (color === undefined ? 'red' : color);
    //     var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //     var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    //     tableRectDiv.style.margin = tableRectDiv.style.padding = '0';
    //     tableRectDiv.style.top = (rect.top + scrollTop) + 'px';
    //     tableRectDiv.style.left = (rect.left + scrollLeft) + 'px';
    //     // We want rect.width to be the border width, so content width is 2px less.
    //     tableRectDiv.style.width = (rect.width - 2) + 'px';
    //     tableRectDiv.style.height = (rect.height - 2) + 'px';
    //     document.body.appendChild(tableRectDiv);
    // }

    function getScreenRect( el ) {
        if ( el ) {
            let rects = el.getClientRects()
            if ( rects.length > 0 ) {
                let rect = {
                    left: 0,
                    top: 0,
                    width: 0,
                    height: 0
                }
                rects.forEach( child => {
                    if ( child.left > rect.left )
                        rect.left = Math.round( child.left )
                    if ( child.top > rect.top )
                        rect.top = Math.round( child.top )
                    if ( child.width > rect.width )
                        rect.width = Math.round( child.width )
                    if ( child.height > rect.height )
                        rect.height = Math.round( child.height )
                } )
                return rect
            }

            if ( el.parentElement ) {
                let index = 0
                while ( el.parentElement.children[ index ] !== el ) index ++
                let rects = el.parentElement.getClientRects()
                return rects[ index ]
            }

        }
    }

    let el = options.clone ? new domain.$el.cloneNode ( true ) : domain.$el
    scene.add( new CSS3DObject( el ) )
    setMainView()
}

View.prototype = Object.create( {} )
View.prototype.constructor = View

export default View
