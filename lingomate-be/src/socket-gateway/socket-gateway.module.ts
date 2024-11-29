/* eslint-disable prettier/prettier */
import { Global, Module } from "@nestjs/common";
import { SocketGatewayService } from "./socket-gateway.service";
import { RedisModule } from "@/common/redis/redis.module";
import { ConfigModule } from "@nestjs/config";

@Global()
@Module({
  imports: [
    ConfigModule,
    RedisModule,
  ],
  providers: [SocketGatewayService],
  exports: [SocketGatewayService],
})
export class SocketGatewayModule {}
