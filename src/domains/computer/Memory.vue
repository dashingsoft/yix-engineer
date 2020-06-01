<template>
  <div class="mem-card">
    <div class="mem-header">
      <span><pre>@</pre></span>
      <radix-input
        :minlength="1"
        :maxlength="20"
        :size="16"
        v-model="selAddr">
      </radix-input>
      <span><pre>:</pre></span>
      <radix-input
        :minlength="1"
        :maxlength="6"
        :size="6"
        v-model="offset">
      </radix-input>
      <span><pre>=</pre></span>
      <radix-input
        :size="16"
        v-model="selValue">
      </radix-input>
    </div>
    <div class="mem-body">
      <div class="mem-addr">
      </div>
      <div class="mem-data" @mouseup="onMouseup">
      </div>
    </div>
  </div>
</template>

<script>

function hexString( c )
{
    return typeof c !== 'number' ? '  ' : c > 0xf ? c.toString(16) : ( '0' + c.toString(16) )
}

function percent( n, t )
{
    return n / t * 100 + '%'
}

export default {
    name: 'Memory',
    props: {
        addr: Number,
        content: Array,
        foldaddrs: Array,
        selections: Array,
    },
    data() {
        return {
            radix: 16,
            col: 16,
            foldlines: [],
            selValue: undefined,
            offset: 0,
            selAddr: undefined
        }
    },
    computed: {
        padding: function () {
            return this.addr % this.col
        },
        size: function () {
            return this.content.length
        },
        row: function () {
            return Math.ceil( ( this.size + this.padding ) / this.col )
        },
    },
    mounted() {
        this.selAddr = this.addr
        this.selSize = this.size
        this.refresh()
    },
    methods: {
        onMouseup() {
            let sel = window.getSelection()
            if ( sel && sel.anchorNode && sel.anchorNode.parentElement.tagName === 'PRE' ) {
                let begin = sel.anchorOffset
                let end = sel.focusOffset
                let size = Math.ceil( ( end - begin ) / 3 )
                let dn = Math.ceil( ( begin + 1 ) / ( this.col * 3 ) )
                let m = Math.ceil( ( begin + 1 ) % ( this.col * 3 ) / 3 ) - 1
                let n = dn - 1
                for ( let i = 0; i < this.foldlines.length; i ++ )
                    if ( n > this.foldlines[ i ][ 0 ] )
                        n += this.foldlines[ i ][ 1 ] - this.foldlines[ i ][ 0 ]
                    else
                        break
                this.selAddr = this.addr - this.padding + n * this.col + m
                this.offset = this.selAddr - this.addr
                if ( ! size )
                    this.selValue = undefined
                else if ( size < 9 ) {
                    let v = this.content.slice( this.offset, this.offset + size )
                    this.selValue = 0
                    for ( let i = 0; i < v.length; i ++ )
                        this.selValue += v[ i ] * ( 2 ** ( i * 8 ) )
                }
                else
                    this.selValue = undefined

            }
        },
        dispRow( n ) {
            let delta = 0
            if ( n === undefined )
                n = this.row
            this.foldlines.forEach( item => {
                let n1 = item[0], n2 = item[1]
                if ( n > n2 )
                    delta += n2 - n1
                else if ( n > n1 )
                    delta += n - n1
            } )
            return n - delta + 1
        },
        isFold( n ) {
            for ( let i = 0; i < this.foldlines.length; i ++ ) {
                let b = this.foldlines[ i ][ 0 ]
                let e = this.foldlines[ i ][ 1 ]
                if ( b == n )
                    return 1
                else if ( n > b && n < e )
                    return 2
                else if ( e == n )
                    return 3
            }
            return 0
        },
        updateFoldLines() {
            let lines = []
            let start = this.addr - this.padding

            if ( this.foldaddrs ) {
                for ( let i = 0; i < this.foldaddrs.length ; i ++ ) {
                    let addr = this.foldaddrs[i].addr
                    let size = this.foldaddrs[i].size
                    let padding = addr % this.col
                    let n = Math.floor( ( addr - start ) / this.col )
                    let t = Math.ceil( ( size + padding ) / this.col )
                    if ( t > 3 ) {
                        let k = lines.length
                        while ( k ) {
                            k --
                            if ( lines[ k ][ 0 ] < n )
                                break
                        }
                        lines.splice( k + 1, 0, [ n + 1, n + t - 2 ] )
                    }
                }
            }
            this.foldlines = lines
        },
        clearHightlight() {
            let el = this.$el.querySelector( '.mem-data' )
            el.querySelectorAll('div.selected').forEach(
                div => el.removeChild( div )
            )
        },
        highlight( start, size ) {
            let el = this.$el.querySelector( '.mem-data' )

            let padding = start % this.col
            let n = Math.floor( ( ( start - padding ) - ( this.addr - this.padding ) ) / this.col )
            let t = Math.floor( ( size + padding ) / this.col )
            let row = this.dispRow( this.row )
            let tail = ( size + padding > this.col ) ? ( size + padding ) % this.col : 0
            let dn1 = this.dispRow( n )
            let dn2 = this.dispRow( n + t )

            // All the selection in the fold area or only one line
            if ( dn1 === dn2 ) {
                let div = document.createElement( 'div' )
                div.className = 'selected'
                div.style.top = percent( dn1, row )
                div.style.left = percent( padding, this.col )
                div.style.bottom = percent( row - dn1 - 1, row )
                div.style.right = tail ? '0' : percent( this.col - size - padding, this.col )
                el.appendChild( div )
                return
            }

            if ( padding ) {
                let div = document.createElement( 'div' )
                div.className = 'selected'
                div.style.top = percent( dn1, row )
                div.style.left = percent( padding, this.col )
                div.style.bottom = percent( row - dn1 - 1, row )
                div.style.right = tail ? '0' : percent( this.col - size - padding, this.col )
                dn1 ++
                el.appendChild( div )
            }

            if ( dn2 > dn1 ) {
                let div = document.createElement( 'div' )
                div.className = 'selected'
                div.style.top = percent( dn1, row )
                div.style.left = '0'
                div.style.bottom = percent( row - dn2, row )
                div.style.right = '0'
                el.appendChild( div )
            }

            if ( tail ) {
                let div = document.createElement( 'div' )
                div.className = 'selected'
                div.style.top = percent( dn2, row )
                div.style.left = '0'
                div.style.bottom = percent( row - dn2 - 1, row )
                div.style.right = percent( this.col - tail, this. col )
                el.appendChild( div )
            }

        },
        refresh() {
            this.updateFoldLines()

            let padding = this.padding
            let n = this.row
            let index = 0

            let lines = [ '<pre class="header">', 'Addr', '</pre>', '<pre>' ]
            let p = this.addr & 0xFFFF - padding
            for ( let i = 0; i < n; i ++, p += this.col ) {
                let k = this.isFold( i )
                if ( k == 1 )
                    lines.push( '...' )
                else if ( k == 0 )
                    lines.push( p.toString( 16 ) )
            }
            lines.push( '</pre>' )
            this.$el.querySelector( '.mem-addr' ).innerHTML = lines.join( '\n' )

            lines = [ '<pre class="header">' ]
            let s = []
            for ( let i = 0; i < this.col; i ++ )
                s.push( hexString( i ) )
            lines.push( s.join( ' ' ) )
            lines.push( '</pre>' )

            lines.push( '<pre>' )
            // First line
            s = []
            for ( let i = 0; i < padding; i ++ )
                s.push( '  ' )
            for ( let j = padding; j < this.col ; j ++, index ++ )
                s.push( hexString( this.content[ index ] ) )
            lines.push( s.join( ' ' ) )

            for ( let i = 1; i < n - 1; i ++ ) {
                let k = this.isFold( i )
                if ( k ) {
                    if ( k == 1 ) {
                        s = []
                        for ( let j = 0; j < this.col ; j ++, index ++ )
                            s.push( '..' )
                        lines.push( s.join( ' ' ) )
                    }
                    index += this.col
                    continue
                }
                s = []
                for ( let j = 0; j < this.col ; j ++, index ++ )
                    s.push( hexString( this.content[ index ] ) )
                lines.push( s.join( ' ' ) )
            }

            // Last line
            if ( n > 1 ) {
                s = []
                while ( index < this.size ) {
                    s.push( hexString( this.content[ index ++ ] ) )
                }
                lines.push( s.join( ' ' ) )
            }

            lines.push( '</pre>' )
            this.$el.querySelector( '.mem-data' ).innerHTML = lines.join( '\n' )

            this.clearHightlight()
            if (this.selections)
                this.selections.forEach( sel => this.highlight( sel.addr, sel.size ) )
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

.mem-header {
    display: flex;
    margin-left: 6px;
}

.mem-header > * {
    padding: 2px 4px;
}

.mem-header > span > pre {
    display: inline-block;
    vertial-align: middle;
}

.mem-body {
    display: flex;
    flex-direction: row;
    text-align: left;

    padding: 6px;
}

.mem-body > div {
    flex-grow: 0;
}

.mem-card pre {
    margin: 0;
}

.mem-card pre.header {
    font-weight: bold;
}

.mem-addr {
    margin: 0 16px 0 6px;
}

.mem-data {
    position: relative;
    overflow: auto;

    padding: 0;
}

.mem-data > div.selected {
    position: absolute;
    background-color: #DCDFE6;
    opacity: .5;
    z-index: -1;
}

</style>
