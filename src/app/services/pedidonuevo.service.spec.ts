import { TestBed } from '@angular/core/testing';

import { PedidonuevoService } from './pedidonuevo.service';

describe('PedidonuevoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PedidonuevoService = TestBed.get(PedidonuevoService);
    expect(service).toBeTruthy();
  });
});
