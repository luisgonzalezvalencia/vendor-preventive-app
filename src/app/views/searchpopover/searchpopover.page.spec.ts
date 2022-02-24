import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchpopoverPage } from './searchpopover.page';

describe('SearchpopoverPage', () => {
  let component: SearchpopoverPage;
  let fixture: ComponentFixture<SearchpopoverPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchpopoverPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchpopoverPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
