// 二层布局模式
//
//    组合两个 SimpleLayout ，中间显示边界层，可以拖动边界层改变两个布局的大小
//
import BaseLayout from './Base.js'
import SimpleLayout from './Simple.js'

const DIRECTION = {
    HORIZON: 0,
    VERTICAL: 1,
}

var LayerLayout = function ( width = 800, height = 600, options ) {

    BaseLayout.call( this, width, height, options )

    let scope = this

    let layouts = [
        new SimpleLayout( width, height, options ),
        new SimpleLayout( width, height, options )
    ]

}

LayerLayout.prototype = Object.create( BaseLayout.prototype )
LayerLayout.prototype.constructor = LayerLayout

export default LayerLayout
