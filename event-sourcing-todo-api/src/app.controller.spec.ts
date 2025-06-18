import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('health', () => {
    it('should return healthy status when app is ready', async () => {
      const statusMock = jest.fn().mockReturnThis();
      const jsonMock = jest.fn();
      const mockResponse = {
        status: statusMock,
        json: jsonMock,
      } as unknown as Response;

      // Simulate app being ready
      appService.onModuleInit();

      await appController.healthCheck(mockResponse);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ok',
          message: 'Application is healthy and ready',
        }),
      );
    });
  });

  describe('ready', () => {
    it('should return ready status when app is ready', () => {
      const statusMock = jest.fn().mockReturnThis();
      const jsonMock = jest.fn();
      const mockResponse = {
        status: statusMock,
        json: jsonMock,
      } as unknown as Response;

      // Simulate app being ready
      appService.onModuleInit();

      appController.readinessCheck(mockResponse);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.OK);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'ready',
          message: 'Application is ready to serve requests',
        }),
      );
    });

    it('should return not ready status when app is not ready', () => {
      const statusMock = jest.fn().mockReturnThis();
      const jsonMock = jest.fn();
      const mockResponse = {
        status: statusMock,
        json: jsonMock,
      } as unknown as Response;

      appController.readinessCheck(mockResponse);

      expect(statusMock).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
      expect(jsonMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'not ready',
          message: 'Application is still starting up',
        }),
      );
    });
  });
});
