import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {TestService} from "apps/lottery-domain/src/strategy/service/TestService";

describe('IStrategyRepository (e2e)', () => {
  let app: INestApplication;
  let repository:TestService

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const strategyEntity = await repository.test();
    console.log("strategyEntity",strategyEntity)
  });
});
