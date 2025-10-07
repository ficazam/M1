import { Controller, Get } from "@nestjs/common";
import type { DashboardPayload } from "@app/schemas";
import { DashboardService } from "./dashboard.service";

@Controller("dashboard")
export class DashboardController {
  constructor(private readonly svc: DashboardService) {}

  @Get()
  async get(): Promise<DashboardPayload> {
    return this.svc.getPayload();
  }
}
