import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  async healthCheck(@Res() res: Response): Promise<void> {
    try {
      await this.appService.waitForReady();

      res.status(HttpStatus.OK).json({
        status: 'ok',
        message: 'Application is healthy and ready',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    } catch (error) {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        message: 'Application failed to start',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  @Get('ready')
  readinessCheck(@Res() res: Response): void {
    const isReady = this.appService.getReadyStatus();

    if (isReady) {
      res.status(HttpStatus.OK).json({
        status: 'ready',
        message: 'Application is ready to serve requests',
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'not ready',
        message: 'Application is still starting up',
        timestamp: new Date().toISOString(),
      });
    }
  }
}
