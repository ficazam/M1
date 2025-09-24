import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DashboardController } from './dashboard/dashboard.controller';
import { HealthController } from './health.controller';

@Module({
  imports: [],
  controllers: [AppController, DashboardController, HealthController],
  providers: [AppService],
})
export class AppModule {}
