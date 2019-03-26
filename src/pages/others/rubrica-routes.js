import AppRubrica from './other-sources/app-rubrica.vue';

export const indexRoutes = [{
    path: '/app-rubrica',
    name: 'rubrica',
    component: AppRubrica
}, {
    path: '/app-rubrica/:cognome/:nome',
    name: 'rubricaCognomeNome',
    component: AppRubrica
}]