import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidonuevoPage } from './pedidonuevo.page';

describe('PedidonuevoPage', () => {
  let component: PedidonuevoPage;
  let fixture: ComponentFixture<PedidonuevoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidonuevoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidonuevoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
