import Engineer from './core/Engineer.vue'
import Controlbar from './core/Controlbar.vue'

export default {
    install ( Vue ) {
        Vue.component( 'yix-engineer', Engineer )
        Vue.component( 'yix-controlbar', Controlbar )
    }
}
