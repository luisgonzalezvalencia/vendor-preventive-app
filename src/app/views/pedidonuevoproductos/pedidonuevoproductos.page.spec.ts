import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidonuevoproductosPage } from './pedidonuevoproductos.page';

describe('PedidonuevoproductosPage', () => {
  let component: PedidonuevoproductosPage;
  let fixture: ComponentFixture<PedidonuevoproductosPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidonuevoproductosPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidonuevoproductosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
