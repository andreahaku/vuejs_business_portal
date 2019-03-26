import Participant from './app-participant.vue';
import Attendance from './app-attendance.vue';
import TeacherBoard from './teacher-board.vue';
import DetailWrapper from './edition-detail-wrapper.vue';

export const tutorRoutes = [{
  path: '/lista-edizioni',
  name: 'lista-edizioni',
  component: TeacherBoard
},
{
  path: '/partecipante/:id',
  name: 'participant',
  component: Participant
},
//attendance testing
{
  path: '/attendance/:id',
  name: 'attendance',
  component: Attendance
},
{
  path: '/edition-detail/:idedizione',
  name: 'edition-detail',
  component: DetailWrapper
}
]