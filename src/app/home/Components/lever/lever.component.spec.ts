import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeverComponent } from './lever.component';

describe('LeverComponent', () => {
  let component: LeverComponent;
  let fixture: ComponentFixture<LeverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeverComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LeverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
