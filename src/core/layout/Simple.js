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
    let _angle = options.angle === undefined ? Math.PI / 8 : options.angle
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

    this.watchDomainMain = function ( domain ) {
        if ( domain ) {
            _main = scope.findItem( domain, true )
            showMasterItem ( _main )
        }
    }

    this.watchDomainDetail = function ( domain, overlay ) {
        if ( domain ) {
            if ( domain.viewStack.length ) {
                let items = domain.viewStack.map( v => scope.findItem( v, true ) )
                items.splice( 0, 0, scope.findItem( domain, true ) )
                let index = items.indexOf( _main )
                index ++
                if ( index > domain.viewStack.length )
                    index = 0
                _main = items[ index ]
                showMasterItem ( _main )

                if ( index && overlay )
                    showOverlayItems( items.slice( 0, index ) )
            }
            else
                scope.watchDomainMain( domain )
        }
    }

    this.watchDomainStack = function ( domain ) {
        if ( domain ) {
            let items = domain.viewStack.map( v => scope.findItem( v, true ) )
            items.splice( 0, 0, scope.findItem( domain, true ) )
            items.length === 1 ? showMasterItem( items[ 0 ] ) : showStackItems( items )
        }
    }

    this.watchDomainDetails = function ( domain ) {
        let items = domain.viewStack.map( v => scope.findItem( v, true ) )
        if ( ! items.length )
            return scope.watchDomainMain( domain )

        items.splice( 0, 0, scope.findItem( domain, true ) )
        showStackItems( items )

        let elements = domain.viewStack.map( v => v.$el )
        elements.splice( 0, 0, domain.$el )
        domain.$nextTick( () => {
            let tweens = items.slice( 1 ).map( ( item, index ) => {
                return item.createTweenFlowIn( elements[ index ] )
            } )
            if ( tweens.indexOf( undefined ) === -1 ) {
                tweens.slice( 0, -1 ).forEach( ( item, index ) => item.chain( tweens[ index + 1 ] ) )
                tweens[ 0 ].start()
            }
        } )
    }

    // Internal functions

    function showMasterItem ( item ) {
        scope.items.forEach ( item => item.visible = false )
        item.visible = true
        item.moveTo( 0, 0 )
        item.setSize( scope.width, scope.height )
        item.reset()
    }

    function showStackItems( items ) {
        let n = items.length
        let vw = scope.width / n
        let vh = scope.height / n

        scope.items.forEach ( item => item.visible = false )

        if ( _mode === MODE.COL2D || _mode === MODE.COL3D ) {
            let y = - scope.height / 2 + vh / 2
            items.forEach( item => {
                item.visible = true
                item.setViewRect( scope.width, vh, scope.angle )
                item.moveTo( 0, y )
                item.control.enabled = true
                y += vh
            } )

        }
        else {
            let x = - scope.width / 2 + vw / 2
            items.forEach( item => {
                item.visible = true
                item.setViewRect( vw, scope.height, scope.angle )
                item.moveTo( x, 0 )
                item.control.enabled = true
                x += vw
            } )
        }
    }

    function showOverlayItems( items ) {
        let vw = 300
        let vh = 180

        let x = - scope.width / 2 + vw / 2
        let y = scope.height / 2 - vh / 2
        items.forEach( item => {
            item.visible = true
            item.moveTo( x, y )
            item.setViewRect( vw, vh, Math.PI / 6 )
            item.control.enabled = false
            y -= vh
        } )
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
