import { DatePipe, NgStyle } from '@angular/common';
import { Component, computed, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonInput } from '@ionic/angular/standalone';
import { DailyValues, MealTypes } from '../data/foodValues';
import { chevronBackOutline, chevronForwardCircleOutline, chevronForwardOutline, pencilOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage';
import { FormsModule } from '@angular/forms';
import { Util } from '../util';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [FormsModule ,IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, DatePipe, IonCardSubtitle, NgStyle, IonGrid, IonRow, IonCol, IonButton, IonIcon, IonInput],
})
export class Tab1Page implements OnInit {

  protected postFixes = signal<string[]>(Util.postFixes);
  protected dateFormat = signal<string>(Util.timeFormat);
  protected shownData = signal<DailyValues>(new DailyValues());
  
  protected totalCalorie = computed<number>(() =>
    (this.shownData().morningIntake.calorieIntake ?? 0) +
    (this.shownData().noonIntake.calorieIntake ?? 0) +  
    (this.shownData().eveningIntake.calorieIntake ?? 0) +
    (this.shownData().extraIntake.calorieIntake ?? 0)
  );

  protected totalProtein = computed<number>(() =>
    (this.shownData().morningIntake.proteinIntake ?? 0) +
    (this.shownData().noonIntake.proteinIntake ?? 0) +  
    (this.shownData().eveningIntake.proteinIntake ?? 0) +  
    (this.shownData().extraIntake.proteinIntake ?? 0)
  );

  protected totalCarb = computed<number>(() =>
    (this.shownData().morningIntake.carbsIntake ?? 0) +
    (this.shownData().noonIntake.carbsIntake ?? 0) +  
    (this.shownData().eveningIntake.carbsIntake ?? 0) +  
    (this.shownData().extraIntake.carbsIntake ?? 0)
  );

  protected totalFat = computed<number>(() =>
    (this.shownData().morningIntake.fatIntake ?? 0)  +
    (this.shownData().noonIntake.fatIntake ?? 0) +  
    (this.shownData().eveningIntake.fatIntake ?? 0) +  
    (this.shownData().extraIntake.fatIntake ?? 0)
  );

  protected meals = signal<MealTypes[]>(Util.mealTypes);
  protected isEdit = signal<boolean>(false);

  backIcon = chevronBackOutline;
  forwardIcon = chevronForwardCircleOutline;
  pencilIcon = pencilOutline;
  
  constructor(private router: Router, private storageService: StorageService) {
    addIcons({ chevronBackOutline, chevronForwardOutline, pencilOutline });
  }

  ngOnInit(): void { 
    this.setData(new Date());
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
    let key = Util.formatDateKey(willDate);
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

  protected editMeal(code :string){ 
    this.router.navigate(['/edit-meal', code, Util.formatDateKey(this.shownData().date)], {
      state: { shownData: this.shownData() } 
    });
  }

  protected openEdit(){
    this.isEdit.set(true);
  }
   
  protected async ionViewWillEnter() {
    const data = await this.storageService.get(Util.formatDateKey(this.shownData().date));
    if (data) { this.shownData.set(data); }
  }

  protected saveBurntValue(){
    this.storageService.set(Util.formatDateKey(this.shownData().date), this.shownData());
    this.isEdit.set(false);
  }
}