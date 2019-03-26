import Wrapper from './wrapper.vue';
import AppJobList from './app-job-list.vue';
import AppJobDetail from './app-job-detail.vue';
import AppCv from './app-cv.vue';
import LoginPage from './app-login.vue';

export const jobRoutes = [{
    path: '/app-recruiting',
    component: Wrapper,
    children: [{
        path: '',
        name: 'jobs',
        component: AppJobList
    },
    {
        path: 'job-detail/:id',
        name: 'detail',
        component: AppJobDetail
    },
    {
        path: 'job-curriculum-vitae',
        name: 'cv',
        component: AppCv
    },
    {
        path: 'career-login',
        name: 'log',
        component: LoginPage
    }
    ]
}]