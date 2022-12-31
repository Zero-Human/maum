import { Module } from '@nestjs/common';
import { PostgreSQLConfigService } from './config.service';

@Module({
  providers: [PostgreSQLConfigService],
})
export class PostgreSQLConfigModule {}
