import Engineer from './core/Engineer.vue'
import Controlbar from './core/Controlbar.vue'
import RealComputer from './domains/real/Computer.vue'

export { RealComputer }

export default {
    install ( Vue ) {
        Vue.component( 'yix-engineer', Engineer )
        Vue.component( 'yix-controlbar', Controlbar )
    }
}
