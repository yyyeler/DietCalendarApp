import { formatDate } from "@angular/common";
import { Decode, IntakeTypes, MealTypes } from "./data/foodValues";

export class Util {
    public static formatDateKey(date : Date) : string { return formatDate(date, 'MM-dd-yyyy', 'en-US');}
    
    public static get timeFormat(): string { return 'd MMMM yyyy'; }
    public static get postFixes(): string[] { return ["kcal","gram"]; }
    public static get intakeTitles(): string[] { return ["Alınan Kal.","Yakılan Kal.","Kal. Açığı","Protein","K.hidrat","Yağ"]; }
    public static get showingOptions(): Decode[] { return [{'code' :'0', 'val': 'Yıl'},{ 'code' :'1', 'val': 'Ay'},{ 'code' :'2', 'val': 'Hafta'}]; }

    public static get mealTypes(): MealTypes[]{
        let arr : MealTypes[] = [];
        arr.push({title: "Sabah", intakeType:"morningIntake"});
        arr.push({title: "Öğle", intakeType:"noonIntake"});
        arr.push({title: "Akşam", intakeType:"eveningIntake"});
        arr.push({title: "Ekstra", intakeType:"extraIntake"});
    
        return arr;
    }

    public static get intakeTypes(): IntakeTypes[]{
        let arr : IntakeTypes[] = [];
        arr.push({title: "Kalori", intakeType:"calorieIntake"});
        arr.push({title: "Karbonhidrat", intakeType:"carbsIntake"});
        arr.push({title: "Protein", intakeType:"proteinIntake"});
        arr.push({title: "Yağ", intakeType:"fatIntake"});

        return arr;
    }

    public static get currentMonth() : string {
        let curMonth = new Date().getMonth();
        curMonth++;
        return curMonth>9 ? curMonth+"" : "0"+curMonth;
    }

    
    public static get months(): Decode[] { return [{'code' :'01', 'val': 'Ocak'},
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
                                        }

                                                
    public static get years() : Decode[] { return Util.yearOptions; }
                                                
    public static get weeks(): Decode[] { return [ {'code' :'-2', 'val': 'Önceki Hafta'},
                                          {'code' :'-1', 'val': 'Geçen Hafta'},
                                          {'code' :'0',  'val': 'Bu Hafta'}]; 
                                    }

    public static get summaryOptions(): Decode[] { return [{'code' :'0', 'val': 'Ortalama Veri'},
                                                  {'code' :'1', 'val': 'Toplam Veri'}];
    }

    private static get yearOptions(){
        let a = new Date();
        let years: Decode[] = [];
        for(let i=0;i<5;i++) {
        let key = a.getFullYear()+"";
        years.push({'code' : key , 'val': key});
        a.setFullYear(a.getFullYear()-1);
        }
        return years;
    }

 }