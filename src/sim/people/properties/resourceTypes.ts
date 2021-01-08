export enum ResourceType {
    Food = "food",
    Wood = "wood",
    Gold = "gold", // This is special as it's not a real resourceType
    Meds = "medicine",
    Tool = "tool",
    Iron = "iron",
    Haus = "housing",
    Serv = "service",
}


export const SPOIL_RATE = {
    food: 0.2,
    meds: 0.2,
    wood: 0.1,
    tool: 0.1,
    housing: 0.02,
}


export function houseToStr(house: number): string {
    let houseStr = house < 10
            ? "SHED"
            : house < 50
            ? "FLAT"
            : house < 300
            ? "HOUSE"
            : house < 1200
            ? "MANSION"
            : "CASTLE";
    return houseStr;
}
