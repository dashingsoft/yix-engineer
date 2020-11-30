export default {

    data () {
        return {
            // 显示属性
            visible: false,

            width: 0,
            height: 0,
            resolution: 1.0,
        }
    },

    mounted () {
        if ( this.$root === this )
            document.querySelector( '.y-domains' ).appendChild( this.$el )

        this.$nextTick( () => {
            let size = this.getScreenSize()
            if ( size === undefined )
                console.warn( this.title + ' could not get screen size' )
            else
                [ this.width, this.height ] = size
            if ( this.scrollWidth )
                this.width = this.scrollWidth
            if ( this.scrollHeight )
                this.height = this.scrollHeight
            console.log( this.title + ' get size ', this.width, this.height )
        } )

    },

    methods: {

        getScreenSize () {
            let el = this.$el.querySelector( '.m-view' )
            if ( ! el ) el = this.$el

            let rect = el.getBoundingClientRect()
            let size = [ Math.round( rect.width ), Math.round( rect.height ) ]
            if ( size[ 0 ] && size[ 1 ] )
                return size

            let rects = el.getClientRects()
            if ( rects.length > 0 ) {
                let left = rects[ 0 ].left
                let right = rects[ 0 ].right
                let top = rects[ 0 ].top
                let bottom = rects[ 0 ].bottom
                rects.forEach( item => {
                    left = item.left < left ? item.left : left
                    right = item.right < right ? item.right : right
                    top = item.top < top ? item.top : top
                    bottom = item.bottom < bottom ? item.bottom : bottom
                } )
                size = [ Math.round( right - left ), Math.round( bottom - top ) ]
                if ( size[ 0 ] && size[ 1 ] )
                    return size
            }

            let parent = el.parentElement
            if ( parent ) {
                let index = 0
                while ( parent.children[ index ] !== el ) index ++
                rect = parent.getClientRects()[ index ]
                if ( rect ) {
                    size = [ Math.round( rect.width ), Math.round( rect.height ) ]
                    if ( size[ 0 ] && size[ 1 ] )
                        return size
                }
            }
        }
    }

}
