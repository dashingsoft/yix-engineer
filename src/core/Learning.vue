<template>
  <div class="y-cover fx-center">
    <el-card class="y-page">
      <div slot="header" class="clearfix">
        <span>学习向导</span>
        <el-button style="float: right; border: 0"
                   size="medium"
                   icon="el-icon-close"
                   @click="closePage"></el-button>
      </div>
      <el-steps style="width: 90%" :active="active" simple>
        <el-step
          title="功能"></el-step>
        <el-step
          title="属性"></el-step>
        <el-step
          title="完成"></el-step>
      </el-steps>
      <div class="y-card" v-show="active == 0">
        <el-form>
          <el-form-item label="域功能列表">
            <el-select
              v-model="domainType"
              clearable
              placeholder="请选择想要了解的功能">
              <el-option
                v-for="item in domainTypes"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="y-card" v-show="active == 1">
        <DataView
          :table-data="domainProps"></DataView>
      </div>
      <div class="y-card" v-show="active == 2">
        <span style="padding: 20px;">{{ prompt }}</span>
      </div>
      <div class="y-footbar">
        <el-button
          round
          :disabled="active == 0"
          icon="el-icon-arrow-left"
          @click="prev">
          上一步
        </el-button>
        <el-button
          round
          :disabled="active == 2"
          @click="next">
          下一步
          <i class="el-icon-arrow-right el-icon--right"></i>
        </el-button>
        <el-button
          round
          plain
          style="margin-left: 100px"
          v-show="true"
          type="primary"
          icon="el-icon-edit-outline"
          @click="finish">
          开始学习
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import DataView from '../components/DataView.vue'

export default {
    name: 'LearningPage',

    components: {
        DataView,
    },

    props: {
    },

    data () {
        return {
            active: 0,
            domainType: '',
            domainTypes: [
                {
                    label: '读写内存',
                    value: 'memory'
                },
                {
                    label: '读写磁盘文件',
                    value: 'disk'
                },
            ],
            domainProps: [
                {
                    name: '自动启动选项',
                    type: 'String',
                    value: ''
                }
            ],
            prompt: '下面会依次使用动画方式展示各个功能和选项的作用'
        }
    },

    methods: {
        next() {
            if ( this.active < 2)
                this.active ++
        },
        prev() {
            if ( this.active > 0 )
                this.active --
        },
        finish() {
            this.$emit( 'page', 'learning', true )
        },
        closePage () {
            this.$emit( 'page', 'learning', false )
        },
    }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.y-cover {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;

    background-color: rgba(240, 240, 240, .86);
    z-index: 100;
}

.fx-center {
    display: flex;
    align-items: center;
    justify-content: center;
}

.y-page.el-card {
    min-width: 60%;
    border-radius: 16px;
}

.y-page .el-card__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    min-height: 300px;
}

.y-page .el-card__body > * {
    margin-bottom: 20px;
    flex-grow: 0;
}

.y-page .el-card__body .y-card {
    flex-grow: 1;
    min-width: 80%;
    text-align: center;
}

.y-page .y-footbar {
    text-align: center;
}

.y-page .y-footbar > * {
    margin-right: 0 20px;
}
</style>
