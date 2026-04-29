import { Request, Response, NextFunction } from 'express';
import { EventService } from '../models/EventService.js';
import { AppError } from '../middleware/errorHandler.js';

export const listPublicEventServices = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await EventService.find({ published: true }).sort({ createdAt: -1 }).limit(20);
    res.json({ success: true, data: { services } });
  } catch (error) {
    next(error);
  }
};

export const listAllEventServices = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const services = await EventService.find({}).sort({ createdAt: -1 });
    res.json({ success: true, data: { services } });
  } catch (error) {
    next(error);
  }
};

export const createEventService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { titre, description, features = [], images = [], slug, published = true } = req.body;
    if (!titre || !description || !slug) {
      throw new AppError('Titre, description et slug sont requis', 400);
    }
    const existing = await EventService.findOne({ slug });
    if (existing) {
      throw new AppError('Un service avec ce slug existe déjà', 400);
    }
    const service = await EventService.create({
      titre,
      description,
      features,
      images,
      slug,
      published,
    });
    res.status(201).json({ success: true, data: { service } });
  } catch (error) {
    next(error);
  }
};

export const updateEventService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const service = await EventService.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!service) {
      throw new AppError('Service non trouvé', 404);
    }
    res.json({ success: true, data: { service } });
  } catch (error) {
    next(error);
  }
};

export const deleteEventService = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const service = await EventService.findByIdAndDelete(id);
    if (!service) {
      throw new AppError('Service non trouvé', 404);
    }
    res.json({ success: true, data: true });
  } catch (error) {
    next(error);
  }
};

