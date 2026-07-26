import { Request, Response, NextFunction } from 'express';
import { schemaMetadataService } from '../services/schema-metadata.service';
import { env } from '../config/env.config';

export class DataController {
  public async getCachedData(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cachedJson = await schemaMetadataService.getCachedSchemaMetadata();
      if (cachedJson && cachedJson.trim().length > 0) {
        res.setHeader('Content-Type', 'application/json');
        res.send(cachedJson);
      } else {
        res.status(404).json({
          status: 'CACHE_MISS',
          message: `No cached schema metadata found for key: ${env.CACHE_KEY}`,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  public async refreshCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const success = await schemaMetadataService.refreshSchemaMetadata();
      if (success) {
        res.json({
          status: 'SUCCESS',
          message: 'PostgreSQL schema stored function executed & Caffeine cache updated successfully.',
          cacheKey: env.CACHE_KEY,
        });
      } else {
        res.status(500).json({
          status: 'ERROR',
          message: 'Failed to populate schema metadata from PostgreSQL stored function.',
        });
      }
    } catch (error) {
      next(error);
    }
  }

  public async evictCache(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      schemaMetadataService.evictSchemaMetadataCache();
      res.json({
        status: 'SUCCESS',
        message: `Schema metadata cache key '${env.CACHE_KEY}' evicted successfully.`,
      });
    } catch (error) {
      next(error);
    }
  }

  public async getHealth(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isCachePresent = schemaMetadataService.isCachePresent();
      res.json({
        status: 'UP',
        configuredStoredFunction: env.STORED_FUNCTION_NAME,
        configuredCacheKey: env.CACHE_KEY,
        notificationChannel: env.NOTIFICATION_CHANNEL,
        isNotificationListenerEnabled: env.NOTIFICATION_ENABLED,
        isCachedDataPresent: isCachePresent,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const dataController = new DataController();
