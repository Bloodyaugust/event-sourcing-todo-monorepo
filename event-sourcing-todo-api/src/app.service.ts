import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private isReady = false;
  private readyPromise: Promise<void>;
  private readyResolve: () => void;
  private readyReject: (error: Error) => void;

  constructor() {
    this.readyPromise = new Promise<void>((resolve, reject) => {
      this.readyResolve = resolve;
      this.readyReject = reject;
    });
  }

  onModuleInit() {
    // Mark the application as ready when the module is initialized
    this.isReady = true;
    this.readyResolve();
  }

  async waitForReady(): Promise<void> {
    if (this.isReady) {
      return;
    }
    return this.readyPromise;
  }

  markAsError(error: Error): void {
    this.readyReject(error);
  }

  getReadyStatus(): boolean {
    return this.isReady;
  }
}
