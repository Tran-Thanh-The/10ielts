import { Global, Module } from "@nestjs/common";
import { SocketGatewayService } from "./socket-gateway.service";
import { RedisModule } from "@/common/redis/redis.module";

@Global()
@Module({
  imports: [RedisModule],
  providers: [SocketGatewayService],
  exports: [SocketGatewayService],
})
export class SocketGatewayModule {}
