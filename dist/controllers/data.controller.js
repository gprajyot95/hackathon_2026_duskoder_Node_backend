"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataController = exports.DataController = void 0;
const schema_metadata_service_1 = require("../services/schema-metadata.service");
const env_config_1 = require("../config/env.config");
class DataController {
    async getCachedData(req, res, next) {
        try {
            const cachedJson = await schema_metadata_service_1.schemaMetadataService.getCachedSchemaMetadata();
            if (cachedJson && cachedJson.trim().length > 0) {
                res.setHeader('Content-Type', 'application/json');
                res.send(cachedJson);
            }
            else {
                res.status(404).json({
                    status: 'CACHE_MISS',
                    message: `No cached schema metadata found for key: ${env_config_1.env.CACHE_KEY}`,
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async refreshCache(req, res, next) {
        try {
            const success = await schema_metadata_service_1.schemaMetadataService.refreshSchemaMetadata();
            if (success) {
                res.json({
                    status: 'SUCCESS',
                    message: 'PostgreSQL schema stored function executed & Caffeine cache updated successfully.',
                    cacheKey: env_config_1.env.CACHE_KEY,
                });
            }
            else {
                res.status(500).json({
                    status: 'ERROR',
                    message: 'Failed to populate schema metadata from PostgreSQL stored function.',
                });
            }
        }
        catch (error) {
            next(error);
        }
    }
    async evictCache(req, res, next) {
        try {
            schema_metadata_service_1.schemaMetadataService.evictSchemaMetadataCache();
            res.json({
                status: 'SUCCESS',
                message: `Schema metadata cache key '${env_config_1.env.CACHE_KEY}' evicted successfully.`,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async getHealth(req, res, next) {
        try {
            const isCachePresent = schema_metadata_service_1.schemaMetadataService.isCachePresent();
            res.json({
                status: 'UP',
                configuredStoredFunction: env_config_1.env.STORED_FUNCTION_NAME,
                configuredCacheKey: env_config_1.env.CACHE_KEY,
                notificationChannel: env_config_1.env.NOTIFICATION_CHANNEL,
                isNotificationListenerEnabled: env_config_1.env.NOTIFICATION_ENABLED,
                isCachedDataPresent: isCachePresent,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
exports.DataController = DataController;
exports.dataController = new DataController();
