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
    let _angle = options.angle === undefined ? 25 : options.angle
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
        let index = items.indexOf( _main )
        index ++
        if ( index > domain.viewStack.length )
            index = 0
        if ( ! index )
            return scope.watchDomainMain( domain )

        showStackItems( items )
        items.slice( index ).forEach( item => item.renderer.domElement.style.opacity = 0 )

        let refel = index === 1 ? domain.$el : domain.viewStack[ index - 2 ].$el
        let item = items[ index ]
        domain.$nextTick( () => {
            window.setTimeout( () => {
                let tween = item.createTweenFlowIn( refel )
                if ( tween ) {
                    tween.start()
                    _main = items[ index ]
                }
            }, 100 )
        } )
    }

    // Internal functions

    function showMasterItem ( item ) {
        scope.items.forEach ( item => item.visible = false )
        item.visible = true
        item.moveTo( 0, 0 )
        item.setSize( scope.width, scope.height )
        item.show()
    }

    function showStackItems( items ) {
        let n = items.length
        let vw = scope.width / n
        let vh = scope.height / n

        scope.items.forEach ( item => item.visible = false )

        if ( _mode === MODE.COL2D || _mode === MODE.COL3D ) {
            let x = - scope.width / 2 + vw / 2
            let y = - scope.height / 2 + vh / 2
            items.forEach( item => {
                item.visible = true
                item.show( {
                    width: scope.width,
                    height: vh,
                    angle: MODE.COL2D ? 0 : scope.angle,
                    direction: 'up'
                } )
                item.moveTo( x, y )
                x += vw
                y += vh
            } )

        }
        else {
            let x = - scope.width / 2 + vw / 2
            items.forEach( item => {
                item.visible = true
                item.show( {
                    width: vw,
                    height: scope.height,
                    angle: scope.angle,
                } )
                item.moveTo( x, 0 )
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
