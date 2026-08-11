import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonGrid, IonCardTitle, IonCol, IonRow, IonItem, IonSelect, IonSelectOption } from '@ionic/angular/standalone';
import { Criteria, DailyValues, Decode, MealValues } from '../data/foodValues';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../services/storage';
import { CommonModule, DatePipe, DecimalPipe, formatDate } from '@angular/common';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  providers: [DecimalPipe],
  imports: [DecimalPipe, CommonModule, IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonGrid, IonCardTitle, IonCol, IonRow, IonItem, IonItem,IonSelect,IonSelectOption,FormsModule, DatePipe]
})
export class Tab2Page implements OnInit{

  constructor(private storageService: StorageService, private decimalPipe: DecimalPipe) { }

  protected postFixes = signal<string[]>(["kcal","gram"]);
  protected titles = signal<string[]>(["Alınan Kal.","Yakılan Kal.","Kal. Açığı","Protein","K.hidrat","Yağ"]);
  protected krt = signal<Criteria>(new Criteria());
  protected showingOptions = signal<Decode[]>([{'code' :'0', 'val': 'Yıl'},{ 'code' :'1', 'val': 'Ay'},{ 'code' :'2', 'val': 'Hafta'}]);
  protected timeOptions = signal<Decode[]>([]);
  protected dateFormat = signal<string>('d MMMM yyyy');

  protected dataList = signal<DailyValues[]>([]);

  protected totalCalorieBurnt = computed<number>(() => { return this.dataList().reduce((sum, item) => sum + (item.burntEnergy ?? 0), 0); });
  protected totalCalorieDef = computed<number>(() => { return this.totalCalorieBurnt() - this.dataList().reduce((sum, item) => sum + (item.morningIntake['calorieIntake']!+ item.noonIntake['calorieIntake']!+ item.eveningIntake['calorieIntake']!+ item.extraIntake['calorieIntake']!), 0); });
  protected totalProteinIntake = computed<number>(() => { return this.dataList().reduce((sum, item) => sum + (item.morningIntake['proteinIntake']!+ item.noonIntake['proteinIntake']!+ item.eveningIntake['proteinIntake']!+ item.extraIntake['proteinIntake']!), 0); });
  protected totalFatIntake = computed<number>(() => { return this.dataList().reduce((sum, item) => sum + (item.morningIntake['fatIntake']!+ item.noonIntake['fatIntake']!+ item.eveningIntake['fatIntake']!+ item.extraIntake['fatIntake']!), 0); });
  protected totalCalorieIntake = computed<number>(() => { return this.dataList().reduce((sum, item) => sum + (item.morningIntake['calorieIntake']!+ item.noonIntake['calorieIntake']!+ item.eveningIntake['calorieIntake']!+ item.extraIntake['calorieIntake']!), 0); });
  protected totalCarbsIntake = computed<number>(() => { return this.dataList().reduce((sum, item) => sum + (item.morningIntake['carbsIntake']!+ item.noonIntake['carbsIntake']!+ item.eveningIntake['carbsIntake']!+ item.extraIntake['carbsIntake']!), 0); });

  protected avgCalorieBurnt = computed<number>(() => this.totalCalorieBurnt() / this.dataList().length);
  protected avgCalorieDef = computed<number>(() => this.totalCalorieDef() / this.dataList().length);
  protected avgProteinIntake = computed<number>(() => this.totalProteinIntake() / this.dataList().length);
  protected avgCalorieIntake = computed<number>(() => this.totalCalorieIntake() / this.dataList().length);
  protected avgFatIntake = computed<number>(() => this.totalFatIntake() / this.dataList().length);
  protected avgCarbsIntake = computed<number>(() =>this.totalCarbsIntake() / this.dataList().length);
  
  protected getAllTotalVals(foodType: keyof MealValues) : number {
    let a = 0;
    this.dataList().forEach(item => a += item.morningIntake[foodType]!+ item.noonIntake[foodType]!+ item.eveningIntake[foodType]!+ item.extraIntake[foodType]!);
    return this.krt().summary == '0' ? a/this.dataList().length : a;
  }
  
  protected readonly months : Decode[] = [{'code' :'01', 'val': 'Ocak'},
                                          {'code' :'02', 'val': 'Şubat'},
                                          {'code' :'03', 'val': 'Mart'},
                                          {'code' :'04', 'val': 'Nisan'},
                                          {'code' :'05', 'val': 'Mayıs'},
                                          {'code' :'06', 'val': 'Haziran'},
                                          {'code' :'07', 'val': 'Temmuz'},
                                          {'code' :'08', 'val': 'Ağustos'},
                                          {'code' :'09', 'val': 'Eylül'},
                                          {'code' :'10', 'val': 'Ekim'},
                                          {'code' :'11', 'val': 'Kasım'},
                                          {'code' :'12', 'val': 'Aralık'}];

                                                
  protected years : Decode[] = [];
                                                
  protected readonly weeks : Decode[] = [ {'code' :'-2', 'val': 'Önceki Hafta'},
                                          {'code' :'-1', 'val': 'Geçen Hafta'},
                                          {'code' :'0',  'val': 'Bu Hafta'}];

  protected readonly summaryOptions : Decode[] = [{'code' :'0', 'val': 'Ortalama Veri'},
                                                  {'code' :'1', 'val': 'Toplam Veri'}];

  ngOnInit(): void {
    this.getYearOptions();

    this.krt().showing = '1';
    this.krt().summary = '0';
    this.showingOptionChanged();
  }

  private getYearOptions(){
    let a = new Date();
    let years: Decode[] = [];
    for(let i=0;i<5;i++) {
      let key = a.getFullYear()+"";
      years.push({'code' : key , 'val': key});
      a.setFullYear(a.getFullYear()-1);
    }
    this.years = years;
  }

  protected getTimeOptions(){
    switch(this.krt().showing){
      case '0': this.timeOptions.set(this.years); break;
      case '1': this.timeOptions.set(this.months); break;
      case '2': this.timeOptions.set(this.weeks); break;
    }
  }

  protected setTimeKrt(){
    if(this.krt().showing == '2') this.krt().time = '0';
    else if(this.krt().showing == '0') this.krt().time = new Date().getFullYear()+"";
    else this.krt().time = this.getCurMonth();
 }

  protected showingOptionChanged(){
    this.getTimeOptions();
    this.setTimeKrt();
    this.getData();
  }

  protected timeOptionChanged(){
    this.getData();
  }

  protected getCurMonth() : string {
    let curMonth = new Date().getMonth();
    curMonth++;
    return curMonth>9 ? curMonth+"" : "0"+curMonth;
  }

  private async getData(){
     if(this.krt().showing == "0"){
      let list: DailyValues[] = [];
      let date = new Date(+this.krt().time,0,1);
      while(this.krt().time === date.getFullYear()+""){
        date.setDate(date.getDate()+1);        
        let key = this.formatDateKey(date);
        let item = await this.getDataFromLocalStorage(key);
        if(item != null) list.push(item);
      }
      this.dataList.set(list);
    }
    else if(this.krt().showing == "1"){
      let list: DailyValues[] = [];
      let dateTemp = new Date();
      let monthLastDate = new Date(dateTemp.getFullYear(), +this.krt().time, 0).getDate();
      let date = new Date(dateTemp.getFullYear(), +this.krt().time-1, 0);
      for(let a=1;a<=monthLastDate;a++){
        date.setDate(date.getDate()+1);            
        let key = this.formatDateKey(date);
        let item = await this.getDataFromLocalStorage(key);
        if(item != null) list.push(item);
      }
      this.dataList.set(list);
    }
    else if(this.krt().showing == "2"){
      let list: DailyValues[] = [];
      let date = new Date();
      let distanceToMonday = date.getDay() === 0 ? -6 : 1 - date.getDay(); 
      let diff = 7*+this.krt().time;
      date.setDate(date.getDate()+diff+distanceToMonday);
      for(let a=1;a<=7;a++){
        date.setDate(date.getDate()+1);        
        let key = this.formatDateKey(date);
        let item = await this.getDataFromLocalStorage(key);
        if(item != null) list.push(item);
      }
      this.dataList.set(list);
    }
  }

  private formatDateKey(date : Date) : string {
     return formatDate(date, 'MM-dd-yyyy', 'en-US');
  }

  private async getDataFromLocalStorage(key: string) : Promise<DailyValues> {
    return await this.storageService.get(key);
  }
  
  protected getTotalVals(item: DailyValues, foodType: keyof MealValues) : number{
    return item.morningIntake[foodType]!+ item.noonIntake[foodType]!+ item.eveningIntake[foodType]!+ item.extraIntake[foodType]!;
  }

  protected get calorieIntake(){ return this.krt().summary == '0' ? this.avgCalorieIntake() : this.totalCalorieIntake(); }
  protected get calorieDef(){ return this.krt().summary == '0' ? this.avgCalorieDef() : this.totalCalorieDef(); }
  protected get calorieBurnt(){ return this.krt().summary == '0' ? this.avgCalorieBurnt() : this.totalCalorieBurnt(); }
  protected get proteinIntake(){ return this.krt().summary == '0' ? this.avgProteinIntake() : this.totalProteinIntake(); }
  protected get carbsIntake(){ return this.krt().summary == '0' ? this.avgCarbsIntake() : this.totalCarbsIntake(); }
  protected get fatIntake(){ return this.krt().summary == '0' ? this.avgFatIntake() : this.totalFatIntake(); }
  protected get color() { return (this.calorieDef < 0)  ? 'red' : (this.calorieDef > 0)  ? 'green' : 'yellow'; }
  protected get infoText(){ return this.color == 'green' ? this.totalCalorieDef()+' kalori açığı oluşturdun. Yaklaşık '+ this.decimalPipe.transform((this.totalCalorieDef()/7700), '1.1-2') +'kg verdin.':
                                   this.color == 'yellow' ? 'Kilonda herhangi bir değişim olmadı.': (this.totalCalorieDef()*-1)+' kalori fazlası oluşturdun. Yaklaşık '+ this.decimalPipe.transform(((this.totalCalorieDef()*-1)/7700), '1.1-2') +'kg aldın.'; }

}
