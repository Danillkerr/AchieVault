import { Test, TestingModule } from '@nestjs/testing';
import { GameEnrichmentService } from './game-enrichment.service';

describe('GameEnrichmentService', () => {
  let service: GameEnrichmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GameEnrichmentService],
    }).compile();

    service = module.get<GameEnrichmentService>(GameEnrichmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
