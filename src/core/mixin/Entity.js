export default {

    computed: {

        scene:   {
            get: function () {
                return this._scene === null ? this.$root.scene : this._scene
            },
            set: function ( value ) {
                this._scene = value
            }
        }

    },

    data () {

        return {
            // 实体层域空间层数都固定为 0
            layer: 0,

            // 绑定的内部 scene ，用来在 Imager 中显示
            _scene: null,

        }

    },

    mounted () {
        this.$el.addEventListener( 'click', this.onEventClick, false )
        this.$el.addEventListener( 'dblclick', this.onEventDoubleClick, false )
    },

    methods: {

        bindScene ( scene ) {
            this.scene = scene
        },

        getScene () {
            return ! this.scene ? this.$root.scene : this.scene

        },

        notifyEngineer ( action, object, arg ) {
            this.$root.$emit( 'engineer', action, object, arg )
        },

        onEventClick ( e ) {
            // e.preventDefault()
            e.stopPropagation()

            this.notifyEngineer( 'click', this, e )
        },

        onEventDoubleClick ( e ) {
            // e.preventDefault()
            e.stopPropagation()

            this.notifyEngineer( 'dblclick', this, e )
        },

    }

}
