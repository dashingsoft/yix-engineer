export default {

    props: {
        basestone: Object
    },

    data () {
        return {
        }
    },

    mounted () {
        this.$el.addEventListener( 'click', this.onEventClick, false )
        this.$el.addEventListener( 'dblclick', this.onEventDoubleClick, false )
    },

    methods: {

        onEventClick ( e ) {
            this.basestone.$root.$emit( 'engineer', 'click', this.basestone, e )
            // e.preventDefault()
            e.stopPropagation()
        },

        onEventDoubleClick ( e ) {
            this.basestone.$root.$emit( 'engineer', 'dblclick', this.basestone, e )
            // e.preventDefault()
            e.stopPropagation()
        },

    }

}
