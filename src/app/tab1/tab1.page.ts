import { DatePipe, formatDate, NgStyle } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon } from '@ionic/angular/standalone';
import { DailyValues, MealTypes, MealValues } from '../data/foodValues';
import { chevronBackOutline, chevronForwardCircleOutline, chevronForwardOutline, pencilOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, DatePipe, IonCardSubtitle, NgStyle, IonGrid, IonRow, IonCol, IonButton, IonIcon],
})
export class Tab1Page implements OnInit {

  protected postFixes = signal<string[]>(["kcal","gram"]);
  protected dateFormat = signal<string>('d MMMM yyyy');
  protected shownData = signal<DailyValues>(new DailyValues());
  
  protected totalCalorie = computed<number>(() =>
    this.shownData().morningIntake.calorieIntake +
    this.shownData().noonIntake.calorieIntake +  
    this.shownData().eveningIntake.calorieIntake +
    this.shownData().extraIntake.calorieIntake 
  );

  protected totalProtein = computed<number>(() =>
    this.shownData().morningIntake.proteinIntake +
    this.shownData().noonIntake.proteinIntake +  
    this.shownData().eveningIntake.proteinIntake +  
    this.shownData().extraIntake.proteinIntake 
  );

  protected totalCarb = computed<number>(() =>
    this.shownData().morningIntake.carbsIntake +
    this.shownData().noonIntake.carbsIntake +  
    this.shownData().eveningIntake.carbsIntake +  
    this.shownData().extraIntake.carbsIntake 
  );

  protected totalFat = computed<number>(() =>
    this.shownData().morningIntake.fatIntake  +
    this.shownData().noonIntake.fatIntake +  
    this.shownData().eveningIntake.fatIntake +  
    this.shownData().extraIntake.fatIntake 
  );

  protected meals = signal<MealTypes[]>([]);

  backIcon = chevronBackOutline;
  forwardIcon = chevronForwardCircleOutline;
  pencilIcon = pencilOutline;
  
  constructor(private router: Router, private storageService: StorageService) {
    addIcons({ chevronBackOutline, chevronForwardOutline, pencilOutline });
  }

  ngOnInit(): void { 
    this.setData(new Date());
    this.meals.set(this.getMealTypes());
  }

  private getMealTypes(): MealTypes[]{
    let arr : MealTypes[] = [];
    arr.push({title: "Sabah", intakeType:"morningIntake"});
    arr.push({title: "Öğle", intakeType:"noonIntake"});
    arr.push({title: "Akşam", intakeType:"eveningIntake"});
    arr.push({title: "Ekstra", intakeType:"extraIntake"});

    return arr;
  }

  private async getDataFromLocalStorage(key: string) : Promise<DailyValues> {
    return await this.storageService.get(key);
  }

  protected checkAndGetFromTheData(diff: number){
    let curDate = this.shownData().date;
    let willDate = new Date();
    willDate.setDate(curDate.getDate()+diff);
    this.setData(willDate);   
  }

  protected async setData(willDate : Date){
    let key = this.formatDateKey(willDate);
    let data = await this.getDataFromLocalStorage(key);
    if(data != null && data != undefined) this.shownData.set(data!);
    else {
      let newItem = new DailyValues();
      newItem.date = willDate;
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
     return formatDate(date, 'MM-dd-yyyy', 'en-US');
  }

  protected editMeal(code :string){
    this.router.navigate(['/edit-meal', code, this.formatDateKey(this.shownData().date)]);
  }

}