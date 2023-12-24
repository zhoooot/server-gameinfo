import { Test, TestingModule } from '@nestjs/testing';
import { GamedataService } from './gamedata.service';

describe('GamedataService', () => {
  let service: GamedataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamedataService],
    }).compile();

    service = module.get<GamedataService>(GamedataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
