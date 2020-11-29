//
// 域空间之间通过各种媒介进行交互，所有可以使用的媒介对象定义在 ../medium
//
// 域空间之间使用 talk 指令传递媒介
//
//      _talk ( target, message, options )
//
//          @target    Vue 实例，接受交谈的对象
//          @message   媒介对象实例，例如 Action
//          @options   全局选项，例如是否动画显示等
//
//              .animation    Bool 是否动画显示
//              .elaboration  Bool 是否进入细节
//              .precision    Int  0 表示递归查询，1 表示仅当前域空间，> 1 表示递归查找的层数
//
// 域空间通过监听 Vue 自定义事件 "talk" 来处理接受到的消息
//
// 所有以 onEventXXXX 的方法用于处理 Vue 的自定义事件 XXXX
//
// 所有以 onListenXXXX 的方法用于处理通过 talk 接受到的消息
//
// 所有以 doActionXXXX 的方法用于执行实际的工作
//
//

import Action from "../medium/Action.js"

export default {

    data () {
        return {
            // 域空间的层次
            //     < 0 表示混沌层
            //     0   表示实体层
            //     > 0 表示文明层
            layer: undefined,

            // 关联的不同比例尺的视图，用于在不同放大倍数情况下的显示
            // 实体层的视图是不同放大倍数的视图
            // 文明层的视图是不同视角，例如数据的二进制和十进制视图
            viewStack: [],

            // 映射域空间
            // 在实体层，这是对应的文明层域空间
            // 在混沌层，这是对应的实体层域空间
            mapStack: [],

            // 属性
            // 组成域空间的材料，类型为 Material 的对象
            materials: [],

            // 显示属性
            width: 0,
            height: 0,
            resolution: 1.0,

        }
    },

    mounted () {

        this.$on( 'talk', this.onEventTalk )

        if ( this.$root === this )
            document.querySelector( '.i-domains' ).appendChild( this.$el )

        this.$nextTick( () => {
            let size = this.getScreenSize()
            if ( size === undefined )
                console.warn( this.title + ' could not get screen size' )
            else
                [ this.width, this.height ] = size
            console.log( this.title + ' get size ' + size )
        } )
    },

    methods: {

        talk ( target, message, options ) {
            this.findTarget( target ).$emit( 'talk', message, options )
        },

        findTarget ( target ) {
            // 如果 target 是一个域空间实例，直接返回
            // 如果 target 是一个域空间定义，在当前域中查找第一个该类型的域空间
            // 如果 target 是一个字符串，在当前域中查找该名称对应的域空间
            // 高级查询支持更多方式来定位域空间
            return target
        },

        findCapacity ( obj, precision ) {
            let m = 'do' + obj.tag + obj.name
            if ( Object.prototype.hasOwnProperty.call( this, m ) )
                return this[ m ]

            // 根据选项确定，是否查找子空间
            if ( ! precision || precision > 1 ) {
                for ( let i = 0; i < this.children.legth; i ++ ) {
                    let meth = this.children[ i ].findCapacity( obj, precision ? precision - 1 : 0 )
                    if ( meth )
                        return meth
                }
            }
        },

        onEventTalk ( obj, options ) {
            let meth = this.findCapacity( obj, options.precision )
            if ( meth ) {
                let result = meth.apply( this, obj.args )
                if ( result === undefined ) {
                    obj.nofify( 'done' )
                }
                else if ( result instanceof Action ) {
                    result.successor = true
                }
                else {
                    // result instanceof Tween
                    obj.tween = result
                    result.onStop = () => {
                        obj.notify( 'stop' )
                    }
                    result.onComplete = () => {
                        obj.nofify( 'done' )
                    }
                }
            }
        },

        getScreenSize () {
            let rect = this.$el.getBoundingClientRect()
            let size = [ Math.round( rect.width ), Math.round( rect.height ) ]
            if ( size[ 0 ] && size[ 1 ] )
                return size

            let rects = this.$el.getClientRects()
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
                size = [ Math.round( right - left ), Math.round( bottom - top ) ]
                if ( size[ 0 ] && size[ 1 ] )
                    return size
            }

            let parent = this.$el.parentElement
            if ( parent ) {
                let index = 0
                while ( parent.children[ index ] !== this.$el ) index ++
                rect = parent.getClientRects()[ index ]
                if ( rect ) {
                    size = [ Math.round( rect.width ), Math.round( rect.height ) ]
                    if ( size[ 0 ] && size[ 1 ] )
                        return size
                }
            }
        },

    }

}

// export { MixinDomain }
