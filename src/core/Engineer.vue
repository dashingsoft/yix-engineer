<template>
  <div class="y-engineer">
    <CoreView :title="title" v-show="isNormalMode">
      <template v-slot:toolbar>
        <el-button
          size="mini"
          title="创建"
          @click="$emit( 'page', 'forge' )"
          icon="el-icon-plus"></el-button>
        <el-button
          size="mini"
          title="动画演示"
          @click="$emit( 'living', 'start' )"
          icon="el-icon-video-camera"></el-button>
        <el-button
          size="mini"
          title="学习研究"
          @click="$emit( 'page', 'learning' )"
          icon="el-icon-reading"></el-button>
        <el-button
          size="mini"
          title="目标设定"
          @click="$emit( 'page', 'mission' )"
          icon="el-icon-alarm-clock"></el-button>
        <el-button
          size="mini"
          title="选项设置"
          @click="$emit( 'page', 'settings' )"
          icon="el-icon-setting"></el-button>
      </template>
      <template v-slot:body>
        <div class="v-left" v-bind:style="{ width: sidebar.width + 'px' }">
          <ExplorerView
            ref="explorer"
            @domain="onEventDomain"
            :main-domain="mainDomain"></ExplorerView>
        </div>
        <div class="v-right">
        </div>
      </template>
    </CoreView>
    <CoreImager
      :viewsets="viewsets"
      ref="imager"></CoreImager>
    <Livingbar
      :state="state"
      @living="onEventLiving"
      @page="onEventPage"
      v-if="isLivingMode"></Livingbar>
    <div class="y-page-container">
      <ForgePage
        v-if="pageVisible.forge"
        @page="onEventPage"></ForgePage>
      <LearningPage
        v-if="pageVisible.learning"
        @page="onEventPage"></LearningPage>
      <MissionPage
        v-if="pageVisible.mission"
        :missions="missions"
        @page="onEventPage"></MissionPage>
      <MaterialPage
        v-if="pageVisible.material"
        :target-object="currentDomain"
        @page="onEventPage"></MaterialPage>
      <LayoutBox
        v-if="pageVisible.layout"
        @page="onEventPage"
        :viewsets="viewsets"></LayoutBox>
      <StartPage
        :title="title"
        action="start"
        :run-options="runOptions"
        @page="onEventPage"
        v-if="pageVisible.start"></StartPage>
      <StartPage
        :title="title"
        action="settings"
        :run-options="runOptions"
        @page="onEventPage"
        v-if="pageVisible.settings"></StartPage>
    </div>
  </div>
</template>

<script>
import CoreView from './View.vue'
import ExplorerView from './Explorer.vue'

import MaterialPage from './Material.vue'
import MissionPage from './Mission.vue'
import ForgePage from './Forge.vue'
import LearningPage from './Learning.vue'
import StartPage from './Start.vue'

import Livingbar from './Livingbar.vue'
import LayoutBox from './Layout.vue'
import CoreImager from './Imager.vue'


const MODE = {
    Normal: 0,
    FullPage: 1,
    FullScreen: 2,
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
    name: 'Engineer',

    components: {
        CoreView,
        ExplorerView,

        ForgePage,
        LearningPage,
        MissionPage,
        StartPage,
        MaterialPage,

        LayoutBox,
        Livingbar,
        CoreImager
    },

    props: {
        title: String
    },

    computed: {

        isNormalMode () {
            return this.mode === MODE.Normal
        },

        isLivingMode () {
            return this.mode === MODE.FullScreen || this.mode === MODE.FullPage
        },

    },

    data() {
        return {
            imager: null,
            mainDomain: null,
            currentDomain: null,

            // 域空间仓库，存放所有注册的域空间
            domainStore: [],

            // 插件
            plugins: [],

            // 当前模式
            mode: MODE.Normal,

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

            // 页面显示控制
            pageVisible: {
                forge: false,
                learning: false,
                mission: false,
                layout: false,
                start: false,
                settings: false,
                material: false,
            },

            // 资源管理器宽度和位置
            sidebar: {
                width: 300,
                top: 50,
            }
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

        this.explorer = this.$refs.explorer

        // 初始化 Imager
        this.imager = this.$refs.imager
        this.onWindowResize()

        // 初始化布局
        this.onLayoutAdd()

        // 初始化快捷键
        window.addEventListener( 'resize', this.onWindowResize, false )
        document.addEventListener( 'keyup', e => {
            this.onKeyup( e )
        } )

        this.$on( 'living', this.onEventLiving )
        this.$on( 'page', this.onEventPage )
        this.$on( 'domain', this.onEventDomain )
    },

    methods: {

        initMainDomain ( domain, actions ) {
            this.mainDomain = domain
            this.mainDomain.$mount()
            this.mainDomain.$on( 'engineer', this.onEventEngineer )

            if ( actions )
                this.actionStack = actions

            this.state = STATE.Ready

            this.imager.$emit( 'watch', this.mainDomain )
            this.imager.$emit( 'busy', true )
        },

        startMainDomain () {
            this.mode = MODE.FullPage
            this.resetViewport()

            this.mainDomain.start()
            this.state = STATE.Running
            this.intervalId = window.setInterval( this.normalize, this.timeUnit )
        },

        stopMainDomain () {
            window.clearInterval( this.intervalId )
        },

        resetViewport () {
            if ( ! this.imager )
                return

            let rect = this.$el.getBoundingClientRect()
            let width = window.innerWidth - rect.left
            let height = window.innerHeight - rect.top

            if ( this.mode === MODE.Normal ) {
                this.imager.translate( this.sidebar.width, this.sidebar.top )
                this.imager.resize( width - this.sidebar.width, height - this.sidebar.top )
            }
            else {
                this.imager.translate( 0, 0 )
                this.imager.resize( width, height )
            }
        },

        onEventPage ( name, action ) {

            if ( action === undefined || action === 'show' )
                this.pageVisible[ name ] = true

            else if ( action === false || action === 'close' )
                this.pageVisible[ name ] = false

            else if ( name === 'mission' ) {
                this.pageVisible.mission = false
            }

            else if ( name === 'forge' ) {
                this.pageVisible.forge = false
            }

            else if ( name === 'layout' ) {
                this.pageVisible.layout = false
            }

            else if ( name === 'start' ) {
                this.pageVisible.start = false
                this.startMainDomain()
            }

            else if ( name === 'learning' ) {
                this.pageVisible.learning = false
            }

            else if ( name === 'material' ) {
                this.pageVisible.material = false
            }

        },

        onEventLiving ( action, arg ) {

            if ( action === 'viewport' ) {
                this.mode = arg
                this.resetViewport()
            }

            else if ( action === 'start' ) {
                this.$emit( 'page', 'start' )
            }

        },

        onEventDomain( action, value ) {
            if ( action === 'select' ) {
                this.currentDomain = value
                this.explorer.setCurrentDomain( value )
            }

            else if ( action === 'edit' ) {
                this.currentDomain = value
                this.$emit( 'page', 'material' )
            }
        },

        onEventEngineer ( action, obj, arg ) {
            if ( action === 'click' ) {
                this.$emit( 'domain', 'select', obj === this.currentDomain ? null : obj )
            }
            else if ( action === 'dblclick' ) {
                console.log( 'dblclick ' + arg )
            }
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
            this.sidebar.top = this.$el.querySelector( '.v-left' ).getBoundingClientRect().top
            this.resetViewport()
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
            if ( this.state === MODE.Ready ) {
                if ( e.code === 'Enter' )
                    this.start()
            }

            else if ( e.code === 'Space' ) {
                this.$emit( 'command', 'pause' )
            }
            else if ( e.code === 'Enter' ) {
                this.$emit( 'command', 'enter', e.ctrlKey, e.altKey )
            }
            else if ( e.code === 'Escape' ) {
                this.pageVisible.layout = false
            }
            else if ( e.code === 'Tab' ) {
                if ( e.shiftKey )
                    this.$emit( 'page', 'layout' )
            }
        },

    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.y-engineer {
    position: relative;
    height: 100%;
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

.y-engineer .y-view {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.y-engineer .v-body {
    flex-grow: 1;

    position: relative;
    display: flex;
}

.y-engineer .v-body > .v-left {
    flex-grow: 0;
    padding: 0 0 4px 0;
}

.y-engineer .v-body > .v-right {
    flex-grow: 1;
}

.x-full {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 0;
}

.i-selected {
    outline: thick outset pink;
}

</style>
