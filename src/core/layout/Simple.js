// 简单布局模式
//
//    当前界面只显示一个主视图
//
import BaseLayout from './Base.js'

const MODE = {
    MASTER: 0,
    ROW3D: 1,
    COL3D: 2,
    ROW2D: 3,
    COL2D: 4,
}


var SimpleLayout = function ( width = 800, height = 600, options ) {

    BaseLayout.call( this, width, height, options )

    let scope = this
    let margin = options.margin === undefined ? 0 : options.margin

    let _mode = MODE.MASTER
    let _main = undefined
    let _angle = Math.PI * 0

    // Property

    Object.defineProperty( this, 'mode', {
        get() {
            return _mode
        },
        set( value ) {
            _mode = ( value === MODE.MASTER - 1 ) ? MODE.COL2D
                : ( value === MODE.COL2D + 1 ) ? MODE.MASTER
                : value
            rearrange()
        }
    } )

    Object.defineProperty( this, 'angle', {
        get() {
            return _angle
        },
        set( value ) {
            _angle = value
            rearrange()
        }
    } )

    // API

    this.addItem = function ( domain, main ) {
        let item = scope.createObject3D( domain.$el )
        item.name = 'i-' + domain._uid

        let rect = domain.$el.getBoundingClientRect()
        if ( rect.width && rect.height ) {
            item.userData.width = rect.width
            item.userData.height = rect.height
        }

        else if ( domain.width && domain.height ) {
            item.userData.width = domain.width
            item.userData.height = domain.height
        }

        else {
            item.userData.width = scope.width
            item.userData.height = scope.height
        }
        item.userData.position = [ 0, 0, 0 ]

        if ( _main === undefined || main )
            _main = main

        scope.scene.add ( item )
        return item
    }

    this.removeItem = function ( item ) {
        scope.scene.remove ( item )
    }

    this.prev = function () {
        scope.mode --
    }

    this.next = function () {
        scope.mode ++
    }

    this.select = function ( item ) {
        _main = item
    }

    this.reset = function () {
        rearrange()
    }

    this.watchMainDomain = function ( domain ) {
        let item = getItem ( domain )

        _main = item
        scope.mode = MODE.MASTER
    }

    this.watchViewStack = function ( domain ) {
        let items = []
        items.push( getItem ( domain ) )
        domain.viewStack.forEach ( v => items.push ( getItem ( v ) ) )
        scope.scene.children.forEach ( child => child.visible = false )
        showStackItems( items )
    }

    // Internal functions

    function getItem ( domain ) {
        let item = scope.scene.getObjectByName( 'i-' + domain._uid )
        return  item ? item : scope.addItem( domain )
    }

    function calculateDistance ( vw, vh ) {
        let mx = scope.width * ( scope.width / 2 - margin )
        let my = scope.height * ( scope.height / 2 - margin )
        let d = Math.max( mx / ( vw / 2 - margin), my / ( vh / 2 - margin ) )
        let d1 = Math.min( mx / scope.width, my / scope.height)
        let d2 = Math.max( mx / vw * 4, my / vh * 4 )
        return [d, d1, d2]
    }

    function showMasterItem ( item ) {
        let pos = item.userData.position
        let [ d, d1, d2 ] = calculateDistance( item.userData.width, item.userData.height )

        scope.camera.lookAt( pos )
        scope.camera.position.set( pos[ 0 ], pos[ 1 ],  pos[ 2 ] + d )
        scope.control.minDistance = d1
        scope.control.maxDistance = d2

        console.log( d, pos, d1, d2 )
        item.visible = true
    }

    function showStackItems( items ) {
        let n = items.length
        let w = scope.width / n
        let h = scope.height / n
        let [ d, d1, d2 ] = calculateDistance( w, h )

        scope.camera.lookAt( 0, 0, 0 )
        scope.control.minDistance = d1
        scope.control.maxDistance = d2

        if ( _mode === MODE.COL2D || _mode === MODE.COL3D ) {
            let dt = h
            let z = - h / 2 + scope.height / 2
            items.forEach( item => {
                item.visible = true
                item.position.set( 0, 0, z )
                z -= dt
            } )
            scope.camera.position.set( 0, d * Math.sin( scope.angle ), d * Math.cos( scope.angle ) )
        }
        else {
            let dt = w
            let z = - w / 2 + scope.width / 2
            items.forEach( item => {
                item.visible = true
                item.position.set( 0, 0, z * 3 )
                console.log( 'position at ' + z )
                z -= dt
            } )
            scope.camera.position.set( d * Math.sin( scope.angle ), 0, d * Math.cos( scope.angle ) )
        }
    }

    function rearrange () {
        if ( ! scope.scene.children.length )
            return

        if ( scope.mode === MODE.MASTER ) {
            scope.scene.children.forEach ( child => child.visible = false )
            showMasterItem ( _main ? _main : scope.scene.children[ 0 ] )
        }
        else {
            scope.scene.children.forEach ( child => child.visible = false )
            showStackItems( scope.scene.children )
        }

        scope.render()
    }

}

SimpleLayout.prototype = Object.create( BaseLayout.prototype )
SimpleLayout.prototype.constructor = SimpleLayout

export default SimpleLayout
