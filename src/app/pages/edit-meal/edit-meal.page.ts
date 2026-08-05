import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCard, IonCol, IonButton, IonIcon, IonCardTitle, IonRow, IonInput } from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { DailyValues, IntakeTypes, MealTypes, MealValues } from 'src/app/data/foodValues';
import { StorageService } from 'src/app/services/storage';

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
  
  protected postFixes = signal<string[]>(["kcal","gram"]);
  protected shownData = signal<DailyValues>(new DailyValues());
  protected dateFormat = signal<string>('d MMMM yyyy');
  protected meals = signal<MealTypes[]>([]);
  protected intakes = signal<IntakeTypes[]>([]);
  protected mealTitle = computed<string>(() => (this.meals().find(x => x.intakeType == this.mealCode())?.title ?? ""));

  constructor( private route: ActivatedRoute, private navCtrl: NavController, private storageService : StorageService) { }

  ngOnInit() {
    this.mealCode.set(this.route.snapshot.paramMap.get('code'));
    this.dateKey.set(this.route.snapshot.paramMap.get('key'));
    this.meals.set(this.getMealTypes());
    this.intakes.set(this.getIntakeTypes());
    this.setData();
  }

  protected async setData(){
    let data = await this.getDataFromLocalStorage(this.dateKey() as string);
    if(data != null && data != undefined) this.shownData.set(data!);
    else {
      let newItem = new DailyValues();
      newItem.date = new Date(this.dateKey() as string);
      this.shownData.set(newItem);
    }
  }

  private async getDataFromLocalStorage(key: string) : Promise<DailyValues> {
    return await this.storageService.get(key);
  }

  save() {
    this.storageService.set(this.dateKey() as string,this.shownData());
    this.close();
  }
  
  close(){
    this.navCtrl.back();
  }

  private getMealTypes(): MealTypes[]{
    let arr : MealTypes[] = [];
    arr.push({title: "Sabah", intakeType:"morningIntake"});
    arr.push({title: "Öğle", intakeType:"noonIntake"});
    arr.push({title: "Akşam", intakeType:"eveningIntake"});
    arr.push({title: "Ekstra", intakeType:"extraIntake"});

    return arr;
  }

  private getIntakeTypes(): IntakeTypes[]{
    let arr : IntakeTypes[] = [];
    arr.push({title: "Kalori", intakeType:"calorieIntake"});
    arr.push({title: "Karbonhidrat", intakeType:"carbsIntake"});
    arr.push({title: "Protein", intakeType:"proteinIntake"});
    arr.push({title: "Yağ", intakeType:"fatIntake"});

    return arr;
  }

  protected get currentMeal(){
    const code = this.mealCode();
    return code ? this.shownData()[code as 'morningIntake' | 'noonIntake' | 'eveningIntake' | 'extraIntake'] : new MealValues();
  }
}
