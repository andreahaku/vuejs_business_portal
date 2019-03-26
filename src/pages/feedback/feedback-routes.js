import feedWrapper from './wrapper.vue';
import AppReceived from './feeds-received.vue';
import AppPersonaRicevuti from './persona-ricevuti.vue';

export const feedRoutes = [{
    path: '/app-feedbacks',
    component: feedWrapper,
    children: [{
        path: '',
        name: 'received',
        component: AppReceived
    }, {
        path: '/person-feedbacks/:idpersona',
        name: "personaFeedback",
        component: AppPersonaRicevuti
    }]
}]