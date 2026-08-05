import { DatePipe, formatDate, NgStyle } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { DailyValues, MealTypes, MealValues } from '../data/foodValues';
import { chevronBackOutline, chevronForwardCircleOutline, chevronForwardOutline, pencilOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, DatePipe, IonCardSubtitle, NgStyle, IonGrid, IonRow, IonCol, IonButton, IonIcon],
})
export class Tab1Page implements OnInit {

  protected postFixes = signal<string[]>(["kcal","gram"]);
  protected allData = signal<Map<string,DailyValues>>(new Map<string,DailyValues>());
  protected dateFormat = signal<string>('d MMMM yyyy');
  protected shownData = signal<DailyValues>(new DailyValues());
  protected totalCalorie = computed<number>(() =>
    this.shownData().morningIntake.calorieIntake +
    this.shownData().noonIntake.calorieIntake +  
    this.shownData().eveningIntake.calorieIntake 
  );

  protected totalProtein = computed<number>(() =>
    this.shownData().morningIntake.proteinIntake +
    this.shownData().noonIntake.proteinIntake+  
    this.shownData().eveningIntake.proteinIntake 
  );

  protected totalCarb = computed<number>(() =>
    this.shownData().morningIntake.carbsIntake +
    this.shownData().noonIntake.carbsIntake +  
    this.shownData().eveningIntake.carbsIntake 
  );

  protected totalFat = computed<number>(() =>
    this.shownData().morningIntake.fatIntake  +
    this.shownData().noonIntake.fatIntake +  
    this.shownData().eveningIntake.fatIntake 
  );

  protected meals = signal<MealTypes[]>([]);

  backIcon = chevronBackOutline;
  forwardIcon = chevronForwardCircleOutline;
  pencilIcon = pencilOutline;
  
  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline, pencilOutline });
  }
  ngOnInit(): void { 
    this.allData.set(this.getDataFromLocalStorage());
    this.setData(new Date());
    this.meals.set(this.getMealTypes());
  }

  private getMockData() : DailyValues {
    let data = new DailyValues();

    data.date = new Date();
    data.morningIntake = this.getIntakeMockData(5);
    data.noonIntake = this.getIntakeMockData(8);
    data.eveningIntake = this.getIntakeMockData(7);
    data.extraIntake = this.getIntakeMockData(2);
    data.burntEnergy = 1500;

    return data;
  }

  private getIntakeMockData(value : number) : MealValues {
    let data = new MealValues();

    data.calorieIntake = 100*value;
    data.carbsIntake = 10*value;
    data.proteinIntake = 6*value;
    data.fatIntake = 4*value;

    return data;
  }
  
  private getMealTypes(): MealTypes[]{
    let arr : MealTypes[] = [];
    arr.push({code: "mo", title: "Sabah", intakeType:"morningIntake"});
    arr.push({code: "no", title: "Öğle", intakeType:"noonIntake"});
    arr.push({code: "ev", title: "Akşam", intakeType:"eveningIntake"});
    arr.push({code: "ex", title: "Ekstra", intakeType:"extraIntake"});

    return arr;
  }

  private getDataFromLocalStorage(): Map<string,DailyValues> {
    let a = this.formatDateKey(new Date());
    let b = new Map<string,DailyValues>();
    b.set(a,this.getMockData());

    console.log(b);

    return  b;
  }

  protected checkAndGetFromTheData(diff: number){
    let curDate = this.shownData().date;
    let willDate = new Date();
    willDate.setDate(curDate.getDate()+diff);
    this.setData(willDate);   
  }

  protected setData(willDate : Date){
    let key = this.formatDateKey(willDate);
    if(this.allData().get(key) != null && this.allData().get(key) != undefined) this.shownData.set(this.allData().get(key)!);
    else {
      let newItem = new DailyValues();
      newItem.date = willDate;
      this.allData().set(key, newItem);
      this.shownData.set(newItem);
    }
  }

  protected showPreviousDay(){
   this.checkAndGetFromTheData(-1);
  }

  protected showNextDay(){
   this.checkAndGetFromTheData(1);
  }

  private formatDateKey(date : Date) : string {
     return formatDate(date, 'dd-MM-yyyy', 'en-US');
  }

  protected editMeal(code :string){
    console.log(code);
  }
}