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


var SimpleLayout = function ( width = 800, height = 600, options = {} ) {

    BaseLayout.call( this, width, height, options )

    let scope = this

    let _mode = options.mode === undefined ? MODE.MASTER : options.mode
    let _angle = options.angle === undefined ? Math.PI / 10 : options.angle
    let _main = options.main

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
    this.addItem = function () {
        arguments.forEach( item => scope.items.push( item ) )
        rearrange()
    }

    this.removeItem = function ( item ) {
        BaseLayout.removeItem.call( this, item )
        rearrange()
    }

    this.watchMainDomain = function ( domain ) {
        let item = scope.findItem( domain, true )
        _main = item
        showMasterItem ( item )
    }

    this.watchMainDomain = function ( domain ) {
        _main = scope.findItem( domain, true )
        showMasterItem ( _main )
    }

    this.watchViewStack = function ( domain ) {
        let items = []
        items.push( scope.findItem( domain, true ) )
        domain.viewStack.forEach( v => items.push( scope.findItem( v, true ) ) )
        items.length === 1 ? showMasterItem( items[ 0 ] ) : showStackItems( items )
    }

    // Internal functions

    function showMasterItem ( item ) {
        scope.items.forEach ( item => item.visible = false )
        item.moveTo( 0, 0 )
        item.setSize( scope.width, scope.height )
        item.reset()
        item.visible = true
    }

    function showStackItems( items ) {
        let n = items.length
        let vw = scope.width / n
        let vh = scope.height / n

        scope.items.forEach ( item => item.visible = false )

        if ( _mode === MODE.COL2D || _mode === MODE.COL3D ) {
            let y = 0
            items.forEach( item => {
                item.visible = true
                item.moveTo( 0, y )
                // item.setSize( scope.width, vh )
                item.reset()
                y += vh
            } )

        }
        else {
            let x = - scope.width / 2 + vw / 2
            items.forEach( item => {
                item.visible = true
                item.setViewport( {
                    left: 0,
                    top: 0,
                    width: vw,
                    height: scope.height
                }, 0 )
                item.moveTo( x, 0 )
                x += vw
            } )
        }
    }

    function rearrange () {
        if ( ! scope.items.length )
            return

        if ( scope.mode === MODE.MASTER )
            showMasterItem ( _main ? _main : scope.items[ 0 ] )

        else
            showStackItems( scope.items )

        scope.render()
    }

}

SimpleLayout.prototype = Object.create( BaseLayout.prototype )
SimpleLayout.prototype.constructor = SimpleLayout

export default SimpleLayout
