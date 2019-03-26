import SchedaImpiegato from './scheda_impiegato.vue';

export const competenceRoutes = [{
    path: '/scheda-impiegato/:idscheda/:ruolo',
    name: 'scheda-impiegato',
    component: SchedaImpiegato
}]