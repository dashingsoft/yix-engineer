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

var MixinDomain = {

    mounted () {
        this.$on( 'talk', this.onEventTalk )
    },

    methods: {

        _talk ( target, message, options ) {
            target.$emit( 'talk', message, options )
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
        }
    }

}

export { MixinDomain }
