// 缩略图布局模式
//
//    继承 SimpleLayout ，但是支持使用鼠标移动整个布局窗口，仅支持水平或者垂直
//

import SimpleLayout from './Simple.js'

const LOCATION = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
}

var OverlayLayout = function ( width = 800, height = 600, location = 2 ) {

    let scope = this
    let size = 160

    let options = {
        left: 0,
        top: height - size
    }
    height -= size

    SimpleLayout.call( this, width, height, options )

    scope.renderer.domElement.style.zIndex = 10
}

OverlayLayout.prototype = Object.create( SimpleLayout.prototype )
OverlayLayout.prototype.constructor = OverlayLayout

export default OverlayLayout
