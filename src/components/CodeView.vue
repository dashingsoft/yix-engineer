<template>
    <div class="y-editor">
    </div>
</template>

<script>
import ace from 'ace-builds'
import 'ace-builds/webpack-resolver'

export default {
    name: 'CodeView',
    props: {
        filename: String,
        content: String,
        options: Object,
    },
    data() {
        return {
            editor: null,
            mode: 'ace/mode/c_cpp',
            theme: 'ace/theme/twilight',
            fontSize: 18,
            tabSize: 4,
            wrapMode: true,
        }
    },
    computed: {
        title: function () {
            return this.filename ? this.filename : "未命名"
        },
    },
    mounted() {
        this.editor = ace.edit( this.$el, {
            mode: this.mode,
            theme: this.theme,
            fontSize: this.fontSize,
            autoScrollEditorIntoView: true,
            displayIndentGuides: false
        });
        // this.editor.renderer.setScrollMargin(10, 10, 10, 10);

        let sesstion = this.editor.getSession()
        session.setUseWrapMode(this.wrapMode)
        session.setTabSize(this.tabSize)
        session.setValue( this.content )
    },
    methods: {
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.y-editor {
    width: 100%;
    height: 100%;
}
</style>
