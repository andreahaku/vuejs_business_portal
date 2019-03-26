import EditionList from './app-edition-list.vue';
import TotalParticipantList from './app-total-participant-list.vue';
import ParticipantList from './app-participant-list.vue';
import Participant from './app-participant.vue';

//attendance testing

import Attendance from './app-attendance.vue';
import TeacherBoard from './teacher-board.vue';
import Detail from './edition-detail-container.vue';

export const tutorRoutes = [{
  path: '/lista-edizioni',
  name: 'lista-edizioni',
  component: TeacherBoard
},
{
  path: '/totale-lista-partecipanti',
  name: 'totale-lista-partecipanti',
  component: TotalParticipantList
},
{
  path: '/lista-partecipanti/:id/:idCorso',
  name: 'lista-partecipanti',
  component: ParticipantList
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
  component: Detail
}
]