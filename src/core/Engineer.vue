<template>
  <div class="y-engineer">
    <CoreView :title="title">
      <template v-slot:toolbar>
        <el-button
          size="mini"
          title="创建"
          icon="el-icon-plus"></el-button>
        <el-button
          size="mini"
          title="学习"
          icon="el-icon-guide"></el-button>
        <el-button
          size="mini"
          title="观察"
          icon="el-icon-video-camera"></el-button>
        <el-button
          size="mini"
          title="使命"
          :missions="missions"
          @click="showMissionPage"
          icon="el-icon-alarm-clock"></el-button>
        <el-button
          size="mini"
          title="选项"
          icon="el-icon-setting"></el-button>
      </template>
      <template v-slot:body>
        引擎轰鸣
      </template>
    </CoreView>
    <MissionPage
      v-if="missionVisible"
      @mission="onEventMission"></MissionPage>
    <div class="y-living" v-show="isLiving">
      <StartPage
        :title="title"
        :options="runOptions"
        v-if="isPrepare"></StartPage>
      <ControlBox
        :mode="mode"
        :state="state"
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
  </div>
</template>

<script>
import CoreView from "./View.vue"
import MixinDomain from './mixin/Domain.js'

import MissionPage from './Mission.vue'
import StartPage from './Start.vue'
import ControlBox from './Control.vue'
import LayoutBox from './Layout.vue'
import CoreImager from './Imager.vue'


const MODE = {
    Idle: 0,
    Living: 1,
    Learning: 2,
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
        CoreView,
        MissionPage,
        StartPage,
        ControlBox,
        LayoutBox,
        CoreImager
    },

    props: {
        title: String
    },

    computed: {

        isPrepare () {
            return this.state === STATE.New || this.state === STATE.Ready
        },

        isLiving () {
            return this.mode === MODE.Living &&
                [ STATE.Running, STATE.Paused ].indexOf( this.state ) !== -1
        },

    },

    data() {
        return {
            imager: null,
            mainDomain: null,

            // 域空间仓库，存放所有注册的域空间
            domainStore: [],

            // 插件
            plugins: [],

            // 当前模式
            mode: MODE.Idle,

            // 运行状态
            state: STATE.New,

            // 操作列表
            actionStack: [],

            // 映射列表，暂时没有使用，
            mapStack: [],

            // 学习步骤，暂时没有使用
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

            // 显示布局
            layoutVisible: false,

            // 显示使命
            missionVisible: false,
        }
    },

    created () {
        // 注册默认域空间，存放到域空间仓库

        // 注册默认 plugins
    },

    mounted () {
        // 调用插件的初始化
        for ( let i = 0; i < this.plugins.length; i ++ )
            this.plugins[ i ].init( this )

        // 初始化 Imager
        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top

        this.imager = this.$refs.imager
        this.imager.resize( width, height )

        // 初始化快捷键
        window.addEventListener( 'resize', this.onWindowResize, false )
        document.addEventListener( 'keyup', e => {
            this.onKeyup( e )
        } )

        // 初始化布局
        this.onLayoutAdd()
    },

    methods: {

        initMainDomain ( domain ) {
            this.mainDomain = domain
            domain.$mount()
        },

        initActionStack ( actions ) {
            this.actionStack = actions
            this.state = STATE.Ready
        },

        run () {
            this.imager.$emit( 'watch', this.mainDomain )
            this.imager.$emit( 'busy', true )
            this.mainDomain.start()

            this.mode = MODE.Living
            this.state = STATE.Running
            this.intervalId = window.setInterval( this.normalize, this.timeUnit )
        },

        showMissionPage () {
            this.missionVisible = true
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

            // while ( this.missions.length ) {
            // }

        },

        onWindowResize () {
            let rect = this.$el.getBoundingClientRect()
            let width = window.innerWidth - rect.left
            let height = window.innerHeight - rect.top
            if ( this.imager )
                this.imager.resize( width, height )
        },

        onEventMission ( ) {
            this.missionVisible = false
        },

        onModeInit ( mode, state, actionStack ) {
            this.mode = mode
            this.state = state
            this.actionStack = actionStack
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
