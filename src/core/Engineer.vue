<template>
  <div class="y-engineer">
    <CoreView
      @page="onEventPage"
      @living="onEventLiving"
      :title="title"
      v-show="isNormalMode">
      <template v-slot:toolbar>
        <el-button
          size="mini"
          title="缩略图模式"
          :class="{ 'x-checked': runOptions.overlayMode }"
          @click="$emit( 'view', 'overlay' )"
          icon="el-icon-news"></el-button>
        <el-button
          size="mini"
          title="关联图模式"
          :class="{ 'x-checked': runOptions.relationMode }"
          @click="$emit( 'view', 'relation' )"
          icon="el-icon-connection"></el-button>
        <el-button
          size="mini"
          title="切换视图排列模式"
          @click="$emit( 'domain', 'stack', currentDomain )"
          icon="el-icon-copy-document"></el-button>
        <el-button
          size="mini"
          title="切换多层视图模式"
          @click="$emit( 'view', 'layer' )"
          icon="el-icon-coin"></el-button>
      </template>
      <template v-slot:body>
        <div class="v-left" v-bind:style="{ width: sidebar.width + 'px' }">
          <ExplorerView
            ref="explorer"
            @layer="onEventLayer"
            @domain="onEventDomain"
            :main-domain="mainDomain"></ExplorerView>
        </div>
        <div class="v-right">
        </div>
      </template>
    </CoreView>
    <CoreImager
      :layouts="activeLayouts"
      :scenes="scenes"
      @imager="onEventImager"
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
      <LayoutPage
        v-if="pageVisible.layout"
        @page="onEventPage"
        :layouts="activeLayouts"></LayoutPage>
      <ScenesPage
        v-if="pageVisible.scenes"
        @page="onEventPage"
        :scenes="scenes"></ScenesPage>
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
    <Speaker></Speaker>
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
import LayoutPage from './Layout.vue'
import ScenesPage from './Scenes.vue'

import Livingbar from './Livingbar.vue'
import CoreImager from './Imager.vue'
import Speaker from './Speaker.vue'

import Manager from './layout/Manager.js'
// import SimpleLayout from './layout/Simple.js'
// import OverlayLayout from './layout/Overlay.js'
// import LayerLayout from './layout/Layer.js'

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
        LayoutPage,
        ScenesPage,

        Livingbar,
        Speaker,
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
            mainDomain: null,
            currentDomain: null,

            // 域空间展示
            imager: null,
            scenes: [],

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
            activeLayouts: [],
            manager: null,

            // 使命和目标
            missions: [],

            runOptions: {
                fullScreen: false,
                overlayMode: true,
                relationMode: false,
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
                scenes: false,
            },

            // 资源管理器宽度和位置
            sidebar: {
                width: 300,
                top: 50,
            },

            // 不同视窗的大小
            viewRects: [ {}, {}, {} ],
        }
    },

    created () {
        // 注册默认域空间，存放到域空间仓库

        // 注册默认 plugins
    },

    mounted () {
        for ( let i = 0; i < this.plugins.length; i ++ )
            this.plugins[ i ].init( this )

        this.explorer = this.$refs.explorer
        this.imager = this.$refs.imager

        this.onWindowResize()
        window.addEventListener( 'resize', this.onWindowResize, false )

        let rect = this.viewRects[ this.mode ]
        this.manager = new Manager( rect.width, rect.height, this.scenes )
        this.activeLayouts.push( this.manager )

        document.addEventListener( 'keyup', e => {
            this.onKeyup( e )
        } )

        this.y_domains = document.createElement( 'div' )
        this.y_domains.className = 'x-full y-domains'
        document.body.appendChild( this.y_domains )

        this.i_relations = document.createElement( 'div' )
        this.i_relations.className = 'i-relations'
        document.body.appendChild( this.i_relations )

        this.$on( 'living', this.onEventLiving )
        this.$on( 'page', this.onEventPage )
        this.$on( 'domain', this.onEventDomain )
        this.$on( 'layer', this.onEventLayer )
        this.$on( 'view', this.onEventView )
        this.$on( 'imager', this.onEventImager )
    },

    methods: {

        initMainDomain ( domain, actions ) {
            this.mainDomain = domain
            this.mainDomain.$mount()
            this.mainDomain.$on( 'engineer', this.onEventEngineer )

            if ( actions )
                this.actionStack = actions

            this.state = STATE.Ready

            this.manager.watchDomainMain( this.mainDomain )
            this.imager.toggleBusy( true )
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

            let rect = this.viewRects[ this.mode ]
            this.imager.translate( rect.left, rect.top )
            this.imager.resize( rect.width, rect.height )
        },

        createLayout () {
            // let rect = this.viewRects[ this.mode ]
            // this.layouts.push( new SimpleLayout( rect.width, rect.height, this.imager.$el ) )
        },

        selectLayout ( index ) {
            // this.currentLayout.visible = false
            // this.currentLayout = this.layouts[ index ]
            // this.currentLayout.visible = true
        },

        removeLayout ( index ) {
            if ( this.activeLayouts.length > 1 ) {
                let layout = this.activeLayouts.splice( index, 1 )
                if ( layout.visible )
                    this.selectLayout( 0 )
            }
        },

        normalize () {
            // 归一化处理，最重要的控制例程

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
            let width = Math.round( window.innerWidth - rect.left )
            let height = Math.round( window.innerHeight - rect.top )

            this.sidebar.top = Math.round(
                this.$el.querySelector( '.v-left' ).getBoundingClientRect().top )

            this.viewRects[ MODE.Normal ].left = this.sidebar.width
            this.viewRects[ MODE.Normal ].top = this.sidebar.top
            this.viewRects[ MODE.Normal ].width = width - this.sidebar.width
            this.viewRects[ MODE.Normal ].height = height - this.sidebar.top

            this.viewRects[ MODE.FullPage ].left = rect.left
            this.viewRects[ MODE.FullPage ].top = rect.top
            this.viewRects[ MODE.FullPage ].width = width
            this.viewRects[ MODE.FullPage ].height = height

            this.viewRects[ MODE.FullScreen ].left = 0
            this.viewRects[ MODE.FullScreen ].top = 0
            this.viewRects[ MODE.FullScreen ].width = window.innerWidth
            this.viewRects[ MODE.FullScreen ].height = window.innerHeight

            this.resetViewport()
        },

        onKeyup ( e ) {
            if ( this.state === MODE.Ready ) {
                if ( e.code === 'Enter' )
                    this.start()
            }

            else if ( e.code === 'Space' ) {
                this.$emit( 'command', 'pause' )
                if ( e.ctrlKey )
                    this.$emit( 'page', 'scenes' )
            }
            else if ( e.code === 'Enter' ) {
                this.$emit( 'command', 'enter', e.ctrlKey, e.altKey )
            }
            else if ( e.code === 'Escape' ) {
                this.pageVisible.layout = false
                this.pageVisible.scenes = false
            }
            else if ( e.code === 'Tab' ) {
                if ( e.shiftKey )
                    this.$emit( 'page', 'layout' )
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

            else if ( name === 'scenes' ) {
                this.pageVisible.scenes = false
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

        onEventDomain ( action, value ) {
            if ( action === 'select' ) {
                this.currentDomain = value
            }

            else if ( action === 'edit' ) {
                this.currentDomain = value
                this.$emit( 'page', 'material' )
            }

            else if ( action === 'detail' ) {
                this.manager.watchDomainDetails ( value, this.runOptions.overlayMode )
            }

            else if ( action === 'show' ) {
                console.log( 'show view ' + value.title )
                this.manager.watchDomainMain ( value )
            }

            else if ( action === 'delete' ) {
                console.log( 'Delete domain ' + value.title )
            }

            else if ( action === 'stack' ) {
                this.manager.watchDomainStack ( value )
            }
        },

        onEventLayer ( action, value, oldValue ) {

            if ( action === 'select' ) {
                console.log( oldValue.title )
                this.manager.watchDomainMain( value )
            }

        },

        onEventView ( action ) {
            if ( action === 'overlay' )
                this.runOptions.overlayMode = ! this.runOptions.overlayMode
            else if ( action === 'relation' )
                this.runOptions.relationMode = ! this.runOptions.relationMode
        },

        onEventEngineer ( action, obj, arg ) {
            if ( action === 'click' ) {
                this.explorer.setCurrentDomain( obj )
            }
            else if ( action === 'dblclick' ) {
                console.log( 'dblclick ' + arg )
            }
        },

        onEventImager ( action ) {
            if ( action === 'click' ) {
                this.explorer.setCurrentDomain( null )
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

.y-domains {
    opacity: 0;
    z-index: -1;
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

.x-checked i {
    box-shadow: 2px 2px 2px 1px #C0C4CC;
}

.i-view {
    display: absolute;
}

.i-part {
    position: absolute;
    cursor: pointer;
}

.i-relation {
    position: absolute;
    transform-origin: left top;
    z-index: 90;
}

.i-layer0 {
}

.i-layer1 {
}

.i-layer2 {
}

</style>
