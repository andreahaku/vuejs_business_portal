import AppDocumenti from './other-sources/app-documenti.vue';

export const docRoutes = [{
    path: '/app-documents',
    name: 'documenti',
    component: AppDocumenti
}, {
    path: '/app-documents/:id',
    name: 'documentiId',
    component: AppDocumenti
}]