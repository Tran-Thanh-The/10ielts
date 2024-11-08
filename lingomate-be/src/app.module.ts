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

import redisConfig from "@/common/redis/config/redis.config";
import { RedisModule } from "@/common/redis/redis.module";
import { HttpModule } from "@nestjs/axios";
import { InvoicesModule } from "./domain/invoices/invoices.module";
import { CategoriesModule } from "@/domain/categories/categories.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { AnswerHistoriesModule } from "@/domain/answer-histories/answer-histories.module";

@Module({
  imports: [
    AnswerHistoriesModule,
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
