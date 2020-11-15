<template>
  <div class="y-engineer">
    <div class="cover" v-show="state === 'init'">
      <el-card class="box-card">
        <div slot="header">
          <span>{{ title }}</span>
        </div>
        <el-form label-width="auto" size="medium">
          <el-form-item label="全屏模式">
            <el-switch v-model="fullScreen"></el-switch>
          </el-form-item>
          <el-form-item label="运行粒度">
            <el-radio-group v-model="runLevel">
              <el-radio :label="1">源代码</el-radio>
              <el-radio :label="2">汇编指令</el-radio>
              <el-radio :label="3">微处理器</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="运行速度">
            <el-rate
              :max="10"
              :texts="speedLabels"
              :show-text="true"
              v-model="speed"></el-rate>
          </el-form-item>
        </el-form>
      </el-card>
      <el-button
        type="success"
        @click="run"
        round>{{ state === 'init' ? '开始' : '返回' }}</el-button>
    </div>
    <div class="actionbar" v-show="actionbarVisible">
      <el-button-group>
        <el-button title="开始和继续"><img src="../assets/play.svg"/></el-button>
        <el-button title="暂停"><img src="../assets/pause.svg"/></el-button>
        <el-button title="终止"><img src="../assets/stop.svg"/></el-button>
      </el-button-group>
      <el-button-group>
        <el-button title="返回到上一级"><img src="../assets/skip-start.svg"/></el-button>
        <el-button title="跳过当前过程"><img src="../assets/skip-end.svg"/></el-button>
      </el-button-group>
      <el-button-group>
        <el-button title="关联窗口模式"><img src="../assets/layers.svg"/></el-button>
        <el-button title="缩略图"><img src="../assets/pip.svg"/></el-button>
        <el-button title="显示布局窗口" @click="layoutbarVisible = true">
          <img src="../assets/view-list.svg"/>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button title="后台运行"><img src="../assets/cursor.svg"/></el-button>
        <el-button title="全屏模式"><img src="../assets/fullscreen.svg"/></el-button>
      </el-button-group>
    </div>
    <div class="layoutbar" v-show="layoutbarVisible" @click="layoutbarVisible = false">
      <div v-for="(item, index) in viewports" :key="index"
        v-bind:style="{ backgroundImage: item.image }">
        <el-button type="text" title="关闭" icon="el-icon-close"></el-button>
      </div>
      <div>
        <div class="toolbox">
          <el-button type="info" title="简单视图"><img src="../assets/square.svg"/></el-button>
          <el-button type="info" title="主从视图"><img src="../assets/grid-1x2.svg"/></el-button>
          <el-button type="info" title="表格视图"><img src="../assets/grid.svg"/></el-button>
        </div>
        <div><i class="el-icon-plus"></i></div>
      </div>
    </div>
    <div class="y-container"></div>
  </div>
</template>

<script>
import Vue from "vue"
import CoreImager from './Imager.vue'

export default {
    name: 'Engineer',

    props: {
        title: String,
        mainDomain: Object
    },

    data() {
        return {
            imager: null,

            // 运行状态:
            //     init, 初始化
            //     run, 正在运行
            //     pause, 暂停运行状态
            //     finish, 正常结束
            //     abort, 未知的异常结束
            //     halt, 系统停止运行
            state: 'init',

            // 是否全屏模式
            fullScreen: false,

            actionbarVisible: false,
            layoutbarVisible: false,

            // 时间单位，单步时长，默认 2000 毫秒
            timeUnit: 2000,
            // 时间计数器
            timeCounter: 0,

            // 操作列表
            actionstack: [],
            // 映射列表
            mapstack: [],

            speed: 1,
            speedMax: 10,
            speedLabels: ['最慢', '慢', '慢', '较慢', '较慢', '较快', '较快', '快', '快', '最快'],

            // 运行粒度，
            runLevel: 1,
            intervalId: null,

            // 视窗
            viewports: [
                { image: "" },
            ],

        }
    },

    mounted () {
        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top

        const Imager = Vue.extend( CoreImager )
        this.imager = new Imager( {
            el: this.$el.querySelector( '.y-container' )
        } )
        this.imager.resize( width, height )

        this.$on( 'pause', this.onEventPause )
        this.$on( 'enter', this.onEventEnter )
        this.$on( 'leave', this.onEventLeave )

        window.addEventListener( 'resize', this.onWindowResize, false )
        document.addEventListener( 'keyup', e => {
            this.onKeyup( e )
        } )
    },

    methods: {

        run () {
            this.state = 'run'
            this.actionbarVisible = true
            this.mainDomain.run()
            this.imager.$emit( 'watch', this.mainDomain )
            this.imager.$emit( 'busy', true )
        },

        onWindowResize() {
            let rect = this.$el.getBoundingClientRect()
            let width = window.innerWidth - rect.left
            let height = window.innerHeight - rect.top
            if ( this.imager )
                this.imager.resize( width, height )
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
                this.$emit( 'enter', e.shiftKey )
            }
            else if ( e.code === 'Escape' ) {
                this.$emit( 'leave', e.shiftKey )
            }
        },

        setViewport () {
        },

        setRunLevel ( value ) {
            // Enter 进入更新粒度，Shfit + Enter 进入更大粒度
            this.runLevel = value
        },

        onEventPause () {
            this.$message( 'pause event' )
        },

        onEventEnter ( shift ) {
            this.$message( 'shift value is ' + shift )
        },

        onEventLeave ( shift ) {
            this.$message( 'leave event with shift ' + shift )
        },

        start () {
            // watch mainDomain
            // mainDomain.run
            this.intervalId = window.setInterval( this.normalize, this.timeUnit )
        },

        stop () {
            window.clearInterval( this.intervalId )
        },

        normalize () {
            this.timeCounter ++;

            for ( let i = 0; i < this.mapstack.length; i ++ )
                this.mapstack[ i ].normalize()

            while ( this.actionstack.length ) {
                let action = this.actionstack.pop()
                if ( action.isFinished() ) {
                    if ( action.successor ) {
                        let prev = this.actionstack.pop()
                        prev.state = action.state
                        this.actionstack.push( prev )
                    }
                }
                else if ( action.isPending() ) {
                    action.notify( 'run' )
                    action.target.$emit( 'talk', action )
                }
                else if ( action.isRunning() )
                    this.actionstack.push( action )
            }

        }

    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.y-engineer {
    position: relative;
}

.y-engineer .cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    background-color: rgba(240, 240, 240, .86);
    z-index: 100;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.y-engineer .cover .box-card {
    width: 400px;
    border-radius: 16px;
}

.y-engineer .cover .el-rate {
    padding-top: 8px;
}

.y-engineer .cover .el-button {
    width: 80%;
    max-width: 180px;
    margin-top: 30px
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
