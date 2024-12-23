export interface IFood {
    id: string;
    caloriesPer100g: number;
}

export interface IDailyCalories {
    date: string;
    timestamp: string;
    amountOfCalories: number;
    foodName: string;
    portion: number;
}

export interface Exercise {
    id: string;
    dates: number[];
    [key: number]: {
        series: number[];
        weight: number[];
    };
}