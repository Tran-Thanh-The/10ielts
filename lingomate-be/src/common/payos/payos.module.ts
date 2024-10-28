import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import PayOS from "@payos/node";
import { PayOSService } from "@/common/payos/payos.service";

@Global()
@Module({
  providers: [
    {
      provide: "PAYOS_CLIENT",
      useFactory: (configService: ConfigService) => {
        const clientId =
          configService.get<string>("PAYOS_CLIENT_ID", {
            infer: true,
          }) ?? "";
        const apiKey =
          configService.get<string>("PAYOS_API_KEY", {
            infer: true,
          }) ?? "";
        const checksumKey =
          configService.get<string>("PAYOS_CHECKSUM_KEY", {
            infer: true,
          }) ?? "";
        return new PayOS(clientId, apiKey, checksumKey);
      },
      inject: [ConfigService],
    },
    PayOSService,
  ],
  exports: ["PAYOS_CLIENT", PayOSService],
})
export class PayOSModule {}
