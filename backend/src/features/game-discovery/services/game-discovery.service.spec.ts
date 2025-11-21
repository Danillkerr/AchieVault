import { Test, TestingModule } from '@nestjs/testing';
import { GameDiscoveryService } from './game-discovery.service';

describe('GameDiscoveryService', () => {
  let service: GameDiscoveryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameDiscoveryService],
    }).compile();

    service = module.get<GameDiscoveryService>(GameDiscoveryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
