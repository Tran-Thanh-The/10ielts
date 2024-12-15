import { AuthModule } from "@/domain/auth/auth.module";
import authConfig from "@/domain/auth/config/auth.config";
import { HomeModule } from "@/domain/home/home.module";
import { SessionModule } from "@/domain/session/session.module";
import { UsersModule } from "@/domain/users/users.module";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { HeaderResolver } from "nestjs-i18n";
import { I18nModule } from "nestjs-i18n/dist/i18n.module";
import path, { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import appConfig from "./config/app.config";
import { AllConfigType } from "./config/config.type";
import databaseConfig from "./database/config/database.config";
import { TypeOrmConfigService } from "./database/typeorm-config.service";
import fileConfig from "./files/config/file.config";
import { FilesModule } from "./files/files.module";
import mailConfig from "./mail/config/mail.config";
import { MailModule } from "./mail/mail.module";
import { MailerModule } from "./mailer/mailer.module";

const infrastructureDatabaseModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    return new DataSource(options).initialize();
  },
});

import { QuestionsModule } from "@/domain/questions/questions.module";

import { AnswersModule } from "@/domain/answers/answers.module";

import { CoursesModule } from "@/domain/courses/courses.module";

import { LessonsModule } from "@/domain/lessons/lessons.module";

import { PracticeExercisesModule } from "@/domain/practice-exercises/practice-exercises.module";

import { PayOSModule } from "@/common/payos/payos.module";
import redisConfig from "@/common/redis/config/redis.config";
import { RedisModule } from "@/common/redis/redis.module";
import { CategoriesModule } from "@/domain/categories/categories.module";
import { PaymentModule } from "@/domain/payment/payment.module";
import { HttpModule } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { ServeStaticModule } from "@nestjs/serve-static";
import { InvoicesModule } from "./domain/invoices/invoices.module";

import { InvoiceProductsModule } from "@/domain/invoice-products/invoice-products.module";

import { AnswerHistoriesModule } from "@/domain/answer-histories/answer-histories.module";

import { ConversationsModule } from "@/domain/conversations/conversations.module";

import { ChatsModule } from "@/domain/chats/chats.module";

import { UserAnswersModule } from "@/domain/user-answers/user-answers.module";
import { RolesModule } from "./domain/roles/roles.module";

@Module({
  imports: [
    UserAnswersModule,
    ChatsModule,
    ConversationsModule,
    AnswerHistoriesModule,
    InvoiceProductsModule,
    CategoriesModule,
    HttpModule,
    InvoicesModule,
    PracticeExercisesModule,
    LessonsModule,
    CoursesModule,
    AnswersModule,
    QuestionsModule,
    UsersModule,
    FilesModule,
    AuthModule,
    SessionModule,
    MailModule,
    MailerModule,
    HomeModule,
    RedisModule,
    PayOSModule,
    PaymentModule,
    RolesModule,
    JwtModule.register({
      global: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "client"),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        databaseConfig,
        authConfig,
        appConfig,
        mailConfig,
        fileConfig,
        redisConfig,
      ],
      envFilePath: [".env"],
    }),
    infrastructureDatabaseModule,
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService<AllConfigType>) => ({
        fallbackLanguage: configService.getOrThrow("app.fallbackLanguage", {
          infer: true,
        }),
        loaderOptions: { path: path.join(__dirname, "/i18n/"), watch: true },
      }),
      resolvers: [
        {
          use: HeaderResolver,
          useFactory: (configService: ConfigService<AllConfigType>) => {
            return [
              configService.get("app.headerLanguage", {
                infer: true,
              }),
            ];
          },
          inject: [ConfigService],
        },
      ],
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class AppModule {}
