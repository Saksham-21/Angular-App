import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DietplanBotComponent } from './dietplan-bot.component';

describe('DietplanBotComponent', () => {
  let component: DietplanBotComponent;
  let fixture: ComponentFixture<DietplanBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DietplanBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DietplanBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
