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

    let relations = document.body.querySelector( '.i-relations' )
    let container = document.body.querySelector( '.y-imager' )
    container.appendChild ( renderer.domElement )

    let control = new Controls( camera, container )

    // API

    this.left = left            // renderer left
    this.top = top              // renderer right
    this.width = width          // renderer width
    this.height = height        // rendere height

    this.domain = domain
    this.camera = camera
    this.scene = scene
    this.renderer = renderer

    Object.defineProperty( this, 'visible', {
        get() {
            return scene.visible
        },
        set( visible ) {
            scene.visible = visible
            domain.visible = visible
            renderer.domElement.style.display = visible ? '' : 'none'
        }
    } )

    this.moveTo = function ( left, top ) {
        scope.left = left
        scope.top = top
        renderer.domElement.style.transform = 'translate(' + left + 'px,' + top + 'px)'
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
        control = 'local'
        scope.show()
    }

    this.show = function ( options = {} ) {
        let vwidth = options.width ? options.width : scope.width
        let vheight = options.height ? options.height : scope.height
        let angle = options.angle ? options.angle : 0
        let direction = options.direction ? options.direction : 'left'
        let scale = options.scale ? options.scale : .8

        let pos = calculateCameraPosition( vwidth * scale, vheight * scale, angle, direction )
        control.reset()
        camera.position.copy( pos )
    }

    this.createTweenFlowIn = function ( refel, options = {} ) {
        let el = scene.children[ 0 ].element
        let refrect = getScreenRect( refel )
        let rect = getScreenRect( el )
        if ( refrect === undefined || rect === undefined ) {
            console.log('无法得到位置信息')
            return
        }

        let duration = options.duration === undefined ? 2000 : options.duration
        let angle = options.angle === undefined ? 0 : options.angle
        let direction = options.direction === undefined ? 'left' : options.direction

        let [ w, h ] = getDomainSize()
        let tempElement = el.cloneNode( true )
        tempElement.className = 'm-relation'
        tempElement.style.left = refrect.left + 'px'
        tempElement.style.top = refrect.top + 'px'
        relations.appendChild( tempElement )

        // console.log( w, h, refrect.width, refrect.height, rect.width, rect.height )
        // debugShowRect( rect )

        return new TWEEN.Tween( {
            left: 0,
            top: 0,
            // sa: Math.min( refrect.width / w, refrect.height / h ),
            sx: refrect.width / w,
            sy: refrect.height / h,
        } ).to( {
            left: rect.left - refrect.left,
            top: rect.top - refrect.top,
            // sx: Math.min( rect.width / w , rect.height / h ),
            sx: rect.width / w,
            sy: rect.height / h,
        }, duration )
            .onStart( () => {
            } )
            .onComplete( () => {
                renderer.domElement.style.opacity = 1
                relations.removeChild( tempElement )
            } )
            .onUpdate( object => {
                tempElement.style.transform =
                    'translate(' + object.left + 'px, ' + object.top + 'px) ' +
                    'scale(' + object.sx + ',' + object.sy + ')'
            } )
    }

    // Internal function

    function getDomainSize() {
        return [ domain.width ? domain.width : scope.width,
                 domain.height ? domain.height : scope.height ]
    }

    function calculateDistanceFitView ( width, height, vwidth, vheight ) {
        let fa = Math.tan( fov / 180 * Math.PI )
        return Math.max( scope.width / fa / ( vwidth - margin ) * width,
                         scope.height / fa / ( vheight - margin ) * height )
    }

    function calculateCameraPosition( vwidth, vheight, angle = 0, direction = 'left' ) {
        let size = getDomainSize()
        let distance = calculateDistanceFitView( size[ 0 ], size[ 1 ], vwidth, vheight )

        const quaternion = new THREE.Quaternion();
        const axis = direction === 'left' ? new THREE.Vector3( 0, 1, 0 )
              : direction === 'right' ? new THREE.Vector3( 0, -1, 0 )
              : direction === 'up' ? new THREE.Vector3( 1, 0, 0 )
              : new THREE.Vector3( -1, 0, 0 )
        quaternion.setFromAxisAngle( axis, angle / 180 * Math.PI )
        const pos = new THREE.Vector3( 0, 0, 1 )
        pos.applyQuaternion( quaternion )
        pos.setLength( distance )

        return pos
    }

    // this.setViewRect = function ( vwidth, vheight, angle ) {
    //     let target = new THREE.Vector3( 0, 0, 0 )
    //     let [ w, h ] = getDomainSize()
    //     let [ d, d1, d2 ] = getDistanceRange( w, h, vwidth, vheight )
    //     control.reset()

    //     scene.children.forEach( child => child.position.copy( target ) )
    //     camera.lookAt( target )
    //     camera.position.copy( target )
    //     camera.position.x += d * Math.sin( angle )
    //     camera.position.z = d * Math.cos( angle )
    //     control.minDistance = d1
    //     control.maxDistance = d2
    // }

    // function getDistanceRange ( width, height, vwidth, vheight ) {
    //     let d = calculateDistanceFitView( width / .9, height / .9, vwidth, vheight )
    //     let d1 = calculateDistanceFitView( width, height, vwidth, vheight )
    //     let d2 = calculateDistanceFitView(  width * 4, height * 4, vwidth, vheight )
    //     return [d, d1, d2]
    // }

    // function setMainView () {
    //     let [ w, h ] = getDomainSize()
    //     let [ d, d1, d2 ] = getDistanceRange( w, h, scope.width, scope.height )
    //     control.reset()

    //     scene.children.forEach( child => child.position.set( 0, 0, 0 ) )
    //     camera.lookAt( 0, 0, 0 )
    //     camera.position.set( 0, 0, d )
    //     control.minDistance = d1
    //     control.maxDistance = d2
    // }

    function debugShowRect( rect, color ) {
        var tableRectDiv = document.createElement('div');
        tableRectDiv.className = 'i-violate'
        tableRectDiv.style.position = 'absolute';
        tableRectDiv.style.zIndex = 99;
        tableRectDiv.style.border = '1px solid ' + (color === undefined ? 'red' : color);
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
        tableRectDiv.style.margin = tableRectDiv.style.padding = '0';
        tableRectDiv.style.top = (rect.top + scrollTop) + 'px';
        tableRectDiv.style.left = (rect.left + scrollLeft) + 'px';
        // We want rect.width to be the border width, so content width is 2px less.
        tableRectDiv.style.width = (rect.width - 2) + 'px';
        tableRectDiv.style.height = (rect.height - 2) + 'px';
        document.body.appendChild(tableRectDiv);
    }

    function getScreenRect( el ) {
        if ( el ) {
            let rects = el.getClientRects()
            if ( rects.length > 0 ) {
                let left = rects[ 0 ].left
                let right = rects[ 0 ].right
                let top = rects[ 0 ].top
                let bottom = rects[ 0 ].bottom
                rects.forEach( item => {
                    left = item.left < left ? item.left : left
                    right = item.right < right ? item.right : right
                    top = item.top < top ? item.top : top
                    bottom = item.bottom < bottom ? item.bottom : bottom
                } )
                return {
                    left: left,
                    right: right,
                    top: top,
                    bottom: bottom,
                    width: right - left,
                    height: bottom - top
                }
            }

            let parent = el.parentElement
            if ( parent ) {
                let index = 0
                while ( parent.children[ index ] !== this.$el ) index ++
                return parent.getClientRects()[ index ]
            }
        }
    }

    // Finally setup
    scene.add( new CSS3DObject( domain.$el ) )
    this.show()
}

View.prototype = Object.create( {} )
View.prototype.constructor = View

export default View
