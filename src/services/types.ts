export interface IFood {
    id: string;
    caloriesPer100g: number;
}

export interface IDailyCalories {
    timestamp: string;
    amountOfCalories: number;
    foodName: string;
    portion: number;
}