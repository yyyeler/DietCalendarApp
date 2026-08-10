export interface MealValues {
    calorieBurnt: number;
    calorieDef: number;
    calorieIntake: number;
    proteinIntake: number;
    carbsIntake: number;
    fatIntake: number;
}

export class MealValues {
    constructor(){
        this.calorieIntake = 0;
        this.proteinIntake = 0;
        this.carbsIntake = 0;
        this.fatIntake = 0;
        this.calorieBurnt = 0;
        this.calorieDef = 0;
    }
}

export interface DailyValues {
    date: Date;
    morningIntake: MealValues;
    noonIntake: MealValues;
    eveningIntake: MealValues;
    extraIntake: MealValues;
    burntEnergy: number;
}

export class DailyValues {
    constructor(){
        this.morningIntake = new MealValues();
        this.noonIntake = new MealValues();
        this.eveningIntake = new MealValues();
        this.extraIntake = new MealValues();
        this.burntEnergy = 0;
    }
}

export interface Criteria {
    showing: string;
    time: string;
}

export class Criteria {}


export type MealTypes = {
    title : string;
    intakeType: 'morningIntake' | 'noonIntake' | 'eveningIntake' | 'extraIntake';
}

export type IntakeTypes = {
    title : string;
    intakeType: 'calorieIntake' | 'proteinIntake' | 'carbsIntake' | 'fatIntake';
}

export type Decode = {
    code : string;
    val : string;
}
