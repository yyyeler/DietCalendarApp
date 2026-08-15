import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCard, IonCol, IonButton, IonIcon, IonCardTitle, IonRow, IonInput } from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from '@angular/router';
import { DailyValues, IntakeTypes, MealTypes, MealValues } from 'src/app/data/foodValues';
import { StorageService } from 'src/app/services/storage';
import { Util } from 'src/app/util';

@Component({
  selector: 'app-edit-meal',
  templateUrl: './edit-meal.page.html',
  styleUrls: ['./edit-meal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow, IonCard, IonCol, IonButton, IonIcon, IonCardTitle, IonInput]
})
export class EditMealPage implements OnInit {
  protected dateKey = signal<string | null>(null);
  protected mealCode = signal<string | null>(null);
  
  protected postFixes = signal<string[]>(Util.postFixes);
  protected shownData = signal<DailyValues>(new DailyValues());
  protected dateFormat = signal<string>(Util.timeFormat);
  protected meals = signal<MealTypes[]>(Util.mealTypes);
  protected intakes = signal<IntakeTypes[]>(Util.intakeTypes);
  protected mealTitle = computed<string>(() => (this.meals().find(x => x.intakeType == this.mealCode())?.title ?? ""));

constructor(private route: ActivatedRoute, private router: Router, private navCtrl: NavController, private storageService : StorageService) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.shownData.set(navigation.extras.state['shownData'] as DailyValues);
    }
  }

  ngOnInit() {
    this.mealCode.set(this.route.snapshot.paramMap.get('code'));
    this.dateKey.set(this.route.snapshot.paramMap.get('key'));
  }

  save() {
    this.storageService.set(this.dateKey() as string,this.shownData());
    this.close();
  }
  
  close(){
    this.navCtrl.back();
  }

  onChangeData(){
    this.shownData.update((prev) => ({ ...prev }));
  }

  protected get currentMeal(){
    const code = this.mealCode();
    return code ? this.shownData()[code as 'morningIntake' | 'noonIntake' | 'eveningIntake' | 'extraIntake'] : new MealValues();
  }
}
