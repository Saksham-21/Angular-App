import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NutritionadviceBotComponent } from './nutritionadvice-bot.component';

describe('NutritionadviceBotComponent', () => {
  let component: NutritionadviceBotComponent;
  let fixture: ComponentFixture<NutritionadviceBotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NutritionadviceBotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NutritionadviceBotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
