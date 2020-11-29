import CoreView from './View.js'

var BaseLayout = function ( width = 800, height = 600, options = {} ) {

    let scope = this
    let items = options.items === undefined ? [] : options.items

    // API
    this.items = items
    this.width = width
    this.height = height
    this.container = options.container

    this.findItem = function ( domain, created = false ) {
        if ( domain ) {
            let source = domain.$root
            for ( let i = 0; i < items.length; i ++ )
                if ( items[ i ].source === source )
                    return items[ i ]
            if ( created ) {
                let item = new CoreView( domain, {
                    width: scope.width,
                    height: scope.height,
                    container: scope.container
                } )
                items.push( item )
                return item
            }
        }
    }

    this.addItem = function () {
        arguments.forEach( item => items.push( item ) )
    }

    this.removeItem = function ( item ) {
        let index = items.indexOf( item )
        if ( index > -1 )
            items.splice( index, 1 )
    }

    this.render = function () {
        items.forEach( item => item.render() )
    }

    this.setSize = function ( w, h ) {
        items.forEach( item => item.setSize( w, h ) )
    }

    this.clear = function () {
        items.clear()
    }
}

BaseLayout.prototype = Object.create( {} )
BaseLayout.prototype.constructor = BaseLayout

export default BaseLayout
