import { Test, TestingModule } from '@nestjs/testing';
import { GameDiscoveryController } from './game-discovery.controller';

describe('GameDiscoveryController', () => {
  let controller: GameDiscoveryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameDiscoveryController],
    }).compile();

    controller = module.get<GameDiscoveryController>(GameDiscoveryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
