import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingsComponent } from './readings.component';

describe('ReadingsComponent', () => {
  let component: ReadingsComponent;
  let fixture: ComponentFixture<ReadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
