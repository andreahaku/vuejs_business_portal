import AppDirectoryGrid from './app-directory-grid.vue';
import AppDirectoryList from './app-directory-list.vue';
import AppForum from './app-forum.vue';
import AppForumThread from './app-forum-thread.vue';
import AppStudentCourse from './app-student-course.vue';
import AppStudentCourses from './app-student-courses.vue';
import AppStudentMessages from './app-student-messages.vue';
import AppTakeCourse from './app-take-course.vue';
import AppTakeModule from './app-take-module.vue';
import StudentDashboard from './student-dashboard.vue';

export const learningRoutes = [{
    path: '/app-directory-grid',
    name: 'grid',
    component: AppDirectoryGrid
}, {
    path: '/app-directory-grid/:filtro',
    name: 'griglia',
    component: AppDirectoryGrid
}, {
    path: '/app-directory-list',
    name: 'list',
    component: AppDirectoryList
}, {
    path: '/app-directory-list/:filtro',
    name: 'lista',
    component: AppDirectoryList
}, {
    path: '/app-forum',
    name: 'forum',
    component: AppForum
}, {
    path: '/app-forum-thread/:iddiscussione',
    name: 'discussione',
    component: AppForumThread
}, {
    path: '/app-student-course/:idcorso',
    name: 'course',
    component: AppStudentCourse
}, {
    path: '/app-student-courses',
    component: AppStudentCourses
}, {
    path: '/app-student-messages',
    component: AppStudentMessages
}, {
    path: '/app-student-messages/:idchat',
    name: 'chat',
    component: AppStudentMessages
}, {
    path: '/app-take-module/:idmodulo/:idedizione',
    name: 'modulo',
    component: AppTakeModule
}, {
    path: '/app-take-course/:idcorso',
    name: 'corso',
    component: AppTakeCourse
}, {
    path: '/app-take-course/:idcorso/:idedizione',
    name: 'corsoWithEd',
    component: AppTakeCourse
}, {
    path: '/student-dashboard',
    name: 'student-dashboard',
    component: StudentDashboard
}]