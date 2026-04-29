import express, { Router } from 'express';
import { sendContactMessage } from '../controllers/contactController.js';
import { validateContact } from '../middleware/validation.js';

const router: Router = express.Router();

router.post('/', validateContact, sendContactMessage);

export default router;

