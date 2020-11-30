import Base from './Base.js'

export default {
    mixins: [ Base ],

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
