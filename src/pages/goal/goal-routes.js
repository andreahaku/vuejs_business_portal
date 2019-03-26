import TabellaMBO from './mbo/tabella_mbo.vue';
import SchedaGoal from './scheda_goal.vue';

export const goalRoutes = [{
    path: '/tabella-mbo',
    name: 'tabella-mbo',
    component: TabellaMBO
}, {
    path: '/scheda-goal/:idvalutazione',
    name: 'scheda-goal',
    component: SchedaGoal
}]