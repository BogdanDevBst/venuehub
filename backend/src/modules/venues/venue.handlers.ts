import { Request, Response, NextFunction } from 'express';
import * as venueService from './venue.service';
import { sendSuccessResponse } from '../../utils/response';

export const createVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venue = await venueService.createVenue({
      ...req.body,
      tenantId: req.tenantId!,
    });
    sendSuccessResponse(res, { venue }, 'Venue created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const getVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venue = await venueService.getVenueById(req.params.id, req.tenantId!);
    sendSuccessResponse(res, { venue });
  } catch (error) {
    next(error);
  }
};

export const listVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await venueService.getVenuesByTenant(req.tenantId!, page, limit);
    sendSuccessResponse(res, result);
  } catch (error) {
    next(error);
  }
};

export const updateVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venue = await venueService.updateVenue(
      req.params.id,
      req.tenantId!,
      req.body
    );
    sendSuccessResponse(res, { venue }, 'Venue updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    await venueService.deleteVenue(req.params.id, req.tenantId!);
    sendSuccessResponse(res, null, 'Venue deleted successfully');
  } catch (error) {
    next(error);
  }
};

export const searchVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = {
      city: req.query.city as string,
      capacityMin: req.query.capacity_min
        ? parseInt(req.query.capacity_min as string)
        : undefined,
      capacityMax: req.query.capacity_max
        ? parseInt(req.query.capacity_max as string)
        : undefined,
      priceMax: req.query.price_max
        ? parseFloat(req.query.price_max as string)
        : undefined,
      amenities: req.query.amenities
        ? (req.query.amenities as string).split(',')
        : undefined,
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
    };

    const result = await venueService.searchVenues(filters);
    sendSuccessResponse(res, result);
  } catch (error) {
    next(error);
  }
};
