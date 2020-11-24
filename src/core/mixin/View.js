export default {

    props: {
        basestone: Object
    },

    data () {
        return {
            // 绑定的 scene ，用来在 Imager 中显示
            scene: undefined,
        }
    },

    mounted () {
        this.$el.addEventListener( 'click', this.onEventClick, false )
        this.$el.addEventListener( 'dblclick', this.onEventDoubleClick, false )
    },

    methods: {

        onEventClick ( e ) {
            this.basestone.notifyEngineer( 'click', this.basestone, e )
            // e.preventDefault()
            e.stopPropagation()
        },

        onEventDoubleClick ( e ) {
            this.basestone.notifyEngineer( 'dblclick', this.basestone, e )
            // e.preventDefault()
            e.stopPropagation()
        },

    }

}
