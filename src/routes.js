import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import ParticipationController from './app/controllers/ParticipationController';
import MeetupAdmin from './app/controllers/MeetupAdmin';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.get('/', (req, res) => res.send('ok'));

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.get('/meetups', MeetupController.index);

routes.post('/meetups', upload.single('file'), MeetupController.store);
routes.put('/meetups', MeetupController.update);
routes.delete('/meetups/:meetingdId', MeetupController.delete);
routes.get('/admin/meetups/', MeetupAdmin.index);

routes.get('/meetups/signup/:mid', ParticipationController.register);
routes.get('/mymeetups', ParticipationController.userMeetings);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
