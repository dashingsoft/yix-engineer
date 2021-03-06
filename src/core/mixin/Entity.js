import { CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

export default {

    computed: {

        scene: {
            get: function () {
                return this.css3dobj
            },
            set: function ( value ) {
                if ( value && this.css3dobj === null ) {
                    if ( this.$root === this ) {
                        this.css3dobj = new CSS3DObject( this.$el )
                        this.css3dobj.userData.used = 0
                    }
                    else {
                        this.$root.scene = true
                        this.css3dobj = this.$root.css3dobj
                    }
                }
            }
        }

    },

    data () {

        return {
            // 实体层域空间层数都固定为 0
            layer: 0,

            // 绑定的内部 CSS3DObject
            css3dobj: null,

        }

    },

    mounted () {
        this.$el.addEventListener( 'click', this.onEventClick, false )
        this.$el.addEventListener( 'dblclick', this.onEventDoubleClick, false )
    },

    methods: {

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
