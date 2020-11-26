// 简单布局模式
//
//    当前界面只显示一个主视图
//
import * as THREE from 'three'

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
    let _mode = MODE.MASTER
    let _main = undefined
    let _angle = Math.PI / 6

    // Property

    Object.defineProperty( this, 'mode', {
        get() {
            return _mode
        },
        set( value ) {
            _mode = ( value === MODE.MASTER - 1 ) ? MODE.COL2D
                : ( value === MODE.COL2D + 1 ) ? MODE.MASTER
                : value
            scope.rearrange()
        }
    } )

    Object.defineProperty( this, 'angle', {
        get() {
            return _angle
        },
        set( value ) {
            _angle = value
            scope.rearrange()
        }
    } )

    // API

    this.addItem = function ( domain, main ) {
        let item = scope.createObject3D( domain.$el )
        item.visible = false

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
        item.userData.position = domain.position ? domain.position ? [ 0, 0, 0 ]

        if ( main ) {
            _main = main
            item.visible = true
        }
        scope.scene.add ( item )
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

    this.reset = function ( item ) {
        rearrange()
    }

    // Internal functions

    function showMasterItem ( item ) {
        let width = item.userData.width
        let height = item.userData.height
        let d = Math.max( width / ( scope.width / 2 - margin ) * scope.width / 2,
                          height / ( scope.height / 2 - margin ) * scope.height / 2 )
        let d1 = Math.min( width, height )
        let d2 = Math.max( width * 8, height * 8 )
        let pos = item.userData.position
        scope.camera.position.set( pos[ 0 ], pos[ 1 ],  pos[ 2 ] + d )
        scope.control.minDistance = d1
        scope.control.maxDistance = d2

        item.visible = true
    }

    function showStackItems( items ) {
        let n = items.length
        let w = scope.width / n
        let h = scope.height / n

        let mw = scope.width * ( scope.width / 2 - margin )
        let mh = scope.height * ( scope.height / 2 - margin )
        let d = Math.max( mw / ( w / 2 - margin), mh / ( h / 2 - margin ) )
        let d1 = Math.min( mw / scope.width, mh / scope.height)
        let d2 = Math.max( mw / w / 8, mh / h / 8 )

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
                item.position.set( 0, 0, z )
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
            scope.scene.children.forEach ( child => child.visible = true )
            showStackItems( scope.scene.children )
        }

        scope.render()
    }

}

SimpleLayout.prototype = Object.create( BaseLayout.prototype )
SimpleLayout.prototype.constructor = SimpleLayout

export default SimpleLayout
