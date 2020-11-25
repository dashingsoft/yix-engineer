import reqwest from '../../plugins/reqwest.js'

// const eStateInvalid = 0
// const eStateUnloaded = 1
// const eStateConnected = 2
// const eStateAttaching = 3
// const eStateLaunching = 4
// const eStateStopped = 5
// const eStateRunning = 6
// const eStateStepping = 7
// const eStateCrashed = 8
// const eStateDetached = 9
// const eStateExited = 10
// const eStateSuspended = 11

const crossOrigin = true
const clientId = ''
const clientSecret = ''
const server = 'http://localhost:9099/'

const send_request = function (api, data, callback) {
    reqwest( {
        url: server + api,
        method: 'post',
        type: 'json',
        contentType: 'application/x-www-form-urlencoded',
        headers: {
            Authorization: 'Basic ' + btoa( clientId + ':' + clientSecret )
        },
        data: JSON.stringify( data ),
        crossOrigin: crossOrigin,
        success: function ( result ) {
            callback( true, result )
        },
        error: function ( e ) {
            callback( false, e )
        }
    } )
}


export default {
    name: 'ProxyComputer',

    data() {
        return {
            ready: false,
        }
    },

    mounted() {
        // this.socket = new WebSocket("ws://127.0.0.1:6789/")
        // this.socket.onmessage = ( event ) => {
        //     this.onMessage( JSON.parse( event.data ) )
        // }
        // this.socket.send( JSON.stringify( {action: 'minus'}));
    },

    methods: {

        proxyLoad ( filename ) {

            send_request( 'command', 'file ' + filename, ( ret, data ) => {
                if ( ret ) {
                    console.log( data )
                }
                // this.$message( 'load return ' + JSON.stringify( data ) )
            } )

        },

    }
}
