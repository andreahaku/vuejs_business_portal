import MainBoard from './main-board.vue';
import Detail from './detail.vue';

export const collectionRoutes = [{
    path: '/main-board',
    name: 'main-board',
    component: MainBoard
}, {
    path: '/collection-detail/:idindice',
    name: 'detail',
    component: Detail
}]