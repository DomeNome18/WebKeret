import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadingsItemComponent } from './readings-item.component';

describe('ReadingsItemComponent', () => {
  let component: ReadingsItemComponent;
  let fixture: ComponentFixture<ReadingsItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReadingsItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReadingsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
