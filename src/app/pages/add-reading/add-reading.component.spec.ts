import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddReadingComponent } from './add-reading.component';

describe('AddReadingComponent', () => {
  let component: AddReadingComponent;
  let fixture: ComponentFixture<AddReadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddReadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
