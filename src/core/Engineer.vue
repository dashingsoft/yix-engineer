<template>
  <div class="y-engineer">
    <StartPage
      :title="title"
      :options="runOptions"
      v-if="isPrepare"></StartPage>
    <ControlBox
      v-if="isLiving"></ControlBox>
    <LayoutBox
      v-if="layoutVisible"
      @hide="hideLayout"
      @add="onLayoutAdd"
      @remove="onLayoutRemove"
      @select="onLayoutSelect"
      :viewsets="viewsets"></LayoutBox>
    <CoreImager
      :viewsets="viewsets"
      ref="imager"></CoreImager>
  </div>
</template>

<script>
import MixinDomain from './mixin/Domain.js'

import StartPage from './Start.vue'
import ControlBox from './Control.vue'
import LayoutBox from './Layout.vue'
import CoreImager from './Imager.vue'


const MODE = {
    Idle: 0,
    Living: 1,
    Learning: 2,
    Setting: 3,
}

const STATE = {
    Unknown: -1,
    New: 0,
    Ready: 1,
    Runing: 2,
    Paused: 3,
    Finshed: 4,
    Aborted: 5
}


export default {
    extends: MixinDomain,
    name: 'Engineer',

    components: {
        StartPage,
        ControlBox,
        LayoutBox,
        CoreImager
    },

    props: {
        title: String,
        mainDomain: Object
    },

    computed: {

        isPrepare () {
            return this.state === STATE.New
        },

        isLiving () {
            return this.mode === MODE.Living &&
                [ STATE.Running, STATE.Paused ].indexOf( this.state ) !== -1
        },

    },

    data() {
        return {
            imager: null,

            // 当前模式
            mode: MODE.Idle,

            // 运行状态
            state: STATE.New,

            // 操作列表
            actionStack: [],

            // 映射列表
            mapStack: [],

            // 学习步骤，每一层堆栈包括：mode, state, actionStack
            frameStack: [],

            // 视图，每一个视图都是一个或者多个视图的集合
            viewsets: [],

            // 使命和目标
            missions: [],

            runOptions: {
                fullScreen: false,
                runSpeed: 1,
                runLevel: 1,
                animation: true,
                elaboration: true,
                precision: 0,
            },

            // 时间单位，单步时长，默认 2000 毫秒
            timeUnit: 2000,
            // 时间计数器
            timeCounter: 0,

            // 定时器 Id
            intervalId: null,

            // 布局模式
            layoutVisible: false,
        }
    },

    mounted () {
        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top

        this.imager = this.$refs.imager
        this.imager.resize( width, height )

        window.addEventListener( 'resize', this.onWindowResize, false )
        document.addEventListener( 'keyup', e => {
            this.onKeyup( e )
        } )
    },

    methods: {

        run () {
            this.state = STATE.Ready

            this.imager.$emit( 'watch', this.mainDomain )
            this.imager.$emit( 'busy', true )
            this.mainDomain.start()

            this.intervalId = window.setInterval( this.normalize, this.timeUnit )
        },

        showLayout () {
            this.layoutVisible = true
        },

        hideLayout () {
            this.layoutVisible = false
        },

        start () {
            this.run()
        },

        stop () {
            window.clearInterval( this.intervalId )
        },

        normalize () {
            if ( this.state !== STATE.Runing )
                return;

            this.timeCounter ++;

            // while ( this.missions.length ) {
            // }

            this.mainDomain.normalize()

            while ( this.actionStack.length ) {
                let action = this.actionStack.pop()
                if ( action.isFinished() ) {
                    if ( action.successor ) {
                        let prev = this.actionStack.pop()
                        prev.state = action.state
                        this.actionStack.push( prev )
                    }
                }
                else if ( action.isPending() ) {
                    action.notify( 'run' )
                    action.target.$emit( 'talk', action )
                }
                else if ( action.isRunning() )
                    this.actionStack.push( action )
            }

        },

        onWindowResize () {
            let rect = this.$el.getBoundingClientRect()
            let width = window.innerWidth - rect.left
            let height = window.innerHeight - rect.top
            if ( this.imager )
                this.imager.resize( width, height )
        },

        onModeStart ( mode, state, actionStack ) {
            this.frameStack.push( {
                mode: this.mode,
                state: this.state,
                actionStack: this.actionStack
            } )

            this.mode = mode
            this.state = state
            this.actionStack = actionStack
        },

        onModeEnd () {
            if ( this.frameStack.length ) {
                let frame = this.frameStack.pop()
                this.mode = frame.mode
                this.state = frame.state
                this.actionStack = frame.actionStack
            }
        },

        onLayoutAdd () {
            const element = document.createElement( 'div' )
            let viewset = {
                inactive: false,
                element: element,
                image: '',
                scenes: []
            }
            this.imager.$el.appendChild( element )
            this.viewsets.push( viewset )
        },

        onLayoutSelect ( index ) {
            this.viewsets.forEach( item => item.inactive = true )
            this.viewsets[ index ].inactive = false
        },

        onLayoutRemove ( index ) {
            let item = this.viewsets.splice( index, 1 )
            this.imager.$el.removeChild( item.element )
            for ( let i = 0; i < item.scenes.length; i ++ ) {
                let scene = item.scenes[ i ]
                scene.userData.camera.dispose()
                scene.userData.renderer.dispose()
                scene.userData.control.dispose()
                scene.userData.source.destroy()
                scene.dispose()
            }
            if ( ! item.inactive ) {
                if ( ! this.viewsets.length )
                    this.onLayoutAdd()
                this.onLayoutSelect( 0 )
            }
        },

        onKeyup ( e ) {
            console.log ( 'Press ' + e.code )
            if ( this.state === 'init' ) {
                if ( e.code === 'Enter' )
                    this.run()
            }

            else if ( e.code === 'Space' ) {
                this.$emit( 'pause' )
            }
            else if ( e.code === 'Enter' ) {
                this.$emit( 'enter', e.ctrlKey, e.altKey )
            }
            else if ( e.code === 'Escape' ) {
                this.layoutVisible = false
            }
            else if ( e.code === 'Tab' ) {
                if ( e.shiftKey )
                    this.showLayout()
            }
        },

    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.y-engineer {
    position: relative;
}

.y-engineer .actionbar {
    position: absolute;
    top: 6px;
    left: 0;
    right: 0;
    z-index: 10;

    display: flex;
    justify-content: center;
    align-items: center;
}

.y-engineer .actionbar > * {
    margin-right: 9px;
}

.y-engineer .actionbar img {
    width: 1em;
    height: 1em;
}

.y-engineer .actionbar button {
    border: 0;
    background: #F0F0F0;
}

.y-engineer .layoutbar {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    z-index: 20;

    display: flex;
    justify-content: center;
    align-items: strech;

    padding: 16px;
    background: #909399;
}

.y-engineer .layoutbar > div {
    position: relative;
    width: 160px;
    margin-right: 32px;
    text-align: center;
    border: 1px #DCDFE6 solid;
    background-size: cover;
    background-image: linear-gradient(to bottom, rgba(240,240,220,0.5), rgba(150,152,162,0.8))
}

.y-engineer .layoutbar .toolbox {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;

    display: flex;
    justify-content: center;
    align-items: center;

    opacity: 0;
}

.y-engineer .layoutbar .toolbox:hover {
    opacity: 1;
}

.y-engineer .layoutbar button {
    border: 0;
    padding: 9px 16px;
}

.y-engineer .layoutbar img {
    max-width: 100%;
    max-height: 100%;
}

.y-engineer .layoutbar .el-button img {
    width: 1em;
    height: 1em;
}

.y-engineer .layoutbar .el-icon-plus {
    padding: 32px;
    font-size: 2em;
    color: rgba(48, 48, 48, .3);
}

.y-engineer .layoutbar .el-button.el-button--text {
    float: right;
}

</style>
