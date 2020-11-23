export default {

    data () {

        return {
            // 实体层域空间层数都固定为 0
            layer: 0,
        }

    },

    mounted () {
        this.$el.addEventListener( 'click', this.onEventClick, false )
        this.$el.addEventListener( 'dblclick', this.onEventDoubleClick, false )
    },

    methods: {

        onEventClick ( e ) {
            // e.preventDefault()
            e.stopPropagation()

            this.$root.$emit( 'engineer', 'click', this, e )
        },

        onEventDoubleClick ( e ) {
            // e.preventDefault()
            e.stopPropagation()

            this.$root.$emit( 'engineer', 'dblclick', this, e )
        },

    }

}
