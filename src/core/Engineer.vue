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
              <el-radio :label="2">汇编层</el-radio>
              <el-radio :label="3">微指令</el-radio>
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
        @click="state = 'run'"
        round>开始</el-button>
    </div>
    <Imager ref="imager"></Imager>
  </div>
</template>

<script>
import Imager from './Imager.vue'

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
            speed: 2,
            speedMax: 10,
            speedLabels: ['最慢', '', '', '', '', '', '', '', '', '最快'],

            // 运行粒度，
            runLevel: 1
        }
    },

    mounted () {
        let rect = this.$el.getBoundingClientRect()
        let width = window.innerWidth - rect.left
        let height = window.innerHeight - rect.top
        this.$refs.imager.resize( width, height )

        this.$on( 'pause', this.onEventPause )
        this.$on( 'level', this.onEventLevel )
        
        window.addEventListener( 'resize', this.onWindowResize, false )
        document.addEventListener( 'keyup', e => {
            this.onKeyup( e )
        } )
    },

    methods: {

        run () {
            this.state = 'run'
        },
        
        onWindowResize() {
            console.log('this.$refs is ' + this.$refs)
            let rect = this.$el.getBoundingClientRect()
            let width = window.innerWidth - rect.left
            let height = window.innerHeight - rect.top
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
                this.$emit( 'level', e.shiftKey )
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

        onEventLevel ( zoom ) {
            this.$message( 'zoom value is ' + zoom )
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
</style>
