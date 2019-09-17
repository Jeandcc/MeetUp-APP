import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import FileController from './app/controllers/FileController';
import MeetupController from './app/controllers/MeetupController';
import ParticipationController from './app/controllers/ParticipationController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.get('/', (req, res) => res.send('ok'));

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/meetups', upload.single('file'), MeetupController.store);
routes.put('/meetups', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.delete('/meetups/:meetingdId', MeetupController.delete);

routes.get('/meetups/signup/:mid', ParticipationController.register);
routes.get('/mymeetups/', ParticipationController.index);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
