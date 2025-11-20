import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEdit } from './dialog-edit';

describe('DialogEdit', () => {
  let component: DialogEdit;
  let fixture: ComponentFixture<DialogEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
