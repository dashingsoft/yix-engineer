import Action from "../core/Action.js"

var MixinDomain = {

    created() {
        this.$on( 'talk', this.onTalk )
    },

    methods: {
        onTalk: function ( action ) {
            let m = 'onEvent' + action.name
            if ( this.hasOwnProperty( m ) ) {
                let result = this[ m ].apply( this, action.args )
                if ( result === undefined ) {
                    action.nofify( 'done' )
                }
                else if ( result instanceof Action ) {
                    result.successor = true
                }
                else {
                    // result instanceof Tween
                    result.onStop = () => {
                        action.notify( 'stop' )
                    }
                    result.onComplete = () => {
                        action.nofify( 'done' )
                    }
                    action.request = () => {
                        result.stop()
                    }
                }
            }
        }
    }

}

export { MixinDomain }
