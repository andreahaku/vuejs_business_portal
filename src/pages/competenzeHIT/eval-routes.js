import SchedaImpiegato from './scheda_impiegato.vue';

export const competenceHitRoutes = [{
  path: '/scheda-impiegato/:idscheda/:ruolo',
  name: 'scheda-impiegato',
  component: SchedaImpiegato
}]