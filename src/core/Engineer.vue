<template>
  <div class="yix-engineer">
    <div class="cover" v-show="state == 'init'">
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
    <div class="actionbar" v-show="state !== 'init'">
      <el-button-group>
        <el-button type="mini" title="开始和继续"><img src="../assets/play.svg"/></el-button>
        <el-button type="mini" title="暂停"><img src="../assets/pause.svg"/></el-button>
        <el-button type="mini" title="终止"><img src="../assets/stop.svg"/></el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="mini" title="返回到上一级"><img src="../assets/skip-start.svg"/></el-button>
        <el-button type="mini" title="跳过当前过程"><img src="../assets/skip-end.svg"/></el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="mini" title="结构图"><img src="../assets/search.svg"/></el-button>
        <el-button type="mini" title="放大"><img src="../assets/zoom-in.svg"/></el-button>
        <el-button type="mini" title="缩小"><img src="../assets/zoom-out.svg"/></el-button>
        <el-button type="mini" title="缩略图"><img src="../assets/pip.svg"/></el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="mini" title="垂直分割视图">
          <img src="../assets/layout-split.svg"/>
        </el-button>
        <el-button type="mini" title="水平分割视图">
          <img src="../assets/layout-split.svg" style="rotate: 90deg;"/>
        </el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="mini" title="主视图开关"><img src="../assets/grid-1x2.svg"/></el-button>
        <el-button type="mini" title="层叠视图"><img src="../assets/view-list.svg"/></el-button>
        <el-button type="mini" title="单排视图"><img src="../assets/view-stack.svg"/></el-button>
        <el-button type="mini" title="多排视图"><img src="../assets/grid.svg"/></el-button>
      </el-button-group>
    </div>
    <Imager ref="imager"></Imager>
  </div>
</template>

<script>
import Imager from './Imager.vue'
import ActionStack from './Action.js'

export default {
    name: 'Engineer',

    components: {
        Imager
    },

    props: {
        title: String,
        mainDomain: Object
    },

    data() {
        return {
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

            // 时间单位，单步时长，默认 2000 毫秒
            timeUnit: 2000,
            // 时间计数器
            timeCounter: 0,

            // 操作列表
            actionstack: [],
            // 映射列表
            mapstack: new ActionStack(),

            speed: 1,
            speedMax: 10,
            speedLabels: ['最慢', '慢', '慢', '较慢', '较慢', '较快', '较快', '快', '快', '最快'],

            // 运行粒度，
            runLevel: 1,
            intervalId: null,

        }
    },

    mounted () {
        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top
        this.$refs.imager.resize( width, height )

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
            this.mainDomain.run()
            this.$refs.imager.$emit( 'view', this.mainDomain.$el )
        },

        onWindowResize() {
            let rect = this.$el.getBoundingClientRect()
            let width = window.innerWidth - rect.left
            let height = window.innerHeight - rect.top
            if ( this.$refs.imager )
                this.$refs.imager.resize( width, height )
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

            for ( let x in this.mapstack )
                x.normalize()

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

.yix-engineer {
    position: relative;
}

.yix-engineer .cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    background-color: rgba(240, 240, 240, .86);
    z-index: 10;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.yix-engineer .cover .box-card {
    width: 400px;
    border-radius: 16px;
}

.yix-engineer .cover .el-rate {
    padding-top: 8px;
}

.yix-engineer .cover .el-button {
    width: 80%;
    max-width: 180px;
    margin-top: 30px
}

.yix-view {
    border: 1px #DCDFE6 solid;
}

.yix-titlebar {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 0 0 6px;
    border-bottom: 1px #E4E7ED solid;
}

.yix-titlebar > * {
    padding-right: 6px;
    flex-grow: 0;
}

.yix-titlebar > span {
    padding: 6px;
}

.yix-titlebar > *:first-child {
    padding: 2px;
}

.yix-titlebar > *:last-child {
    padding-right: 0;
    flex-grow: 1;
    text-align: right;
}

.yix-titlebar button {
    border: 0;
    background: #F0F0F0;
}

.yix-titlebar > .actiongroup > .el-button {
    margin-left: 0;
}

.actionbar {
    position: absolute;
    top: 6px;
    left: 0;
    right: 0;
    z-index: 1;

    display: flex;
    justify-content: center;
    align-items: center;
}

.actionbar > * {
    margin-right: 9px;
}

.actionbar img {
    width: 1em;
    height: 1em;
}

.actionbar button {
    border: 0;
    background: #F0F0F0;
}

.yix-view-body {
}

.invisible-view > i {
    color: lightgray;
}

</style>
