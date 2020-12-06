import { SURNAMES, GIVEN_NAMES_FEMALE,
        GIVEN_NAMES_MALE, ORIGIN_NAME } from '../../../constant/simConstants';
import { Person } from '../person';

export type Heritage = {
    surname: string;
    name: string;
    father: string;
    mother: string;
    gender: number;
    children: string[];
}

function randomSurname(): string {
    return SURNAMES[Math.floor(Math.random()*SURNAMES.length)];
}

function randomGivenName(gender: number): string {
    if (gender) {
        return GIVEN_NAMES_MALE[Math.floor(Math.random()*GIVEN_NAMES_MALE.length)];
    }
    return GIVEN_NAMES_FEMALE[Math.floor(Math.random()*GIVEN_NAMES_FEMALE.length)];
}

export function initialHeritage(): Heritage {
    let surname = randomSurname();
    let gender = Math.floor(Math.random()*2);
    return {
        surname: surname,
        name: randomGivenName(gender),
        father: ORIGIN_NAME,
        mother: ORIGIN_NAME,
        gender: gender,
        children: []
    }
}

export function childHeritage(father: Person, mother: Person, matrilineal: boolean = false): Heritage {
    let surname = matrilineal ? mother.heritage.surname : father.heritage.surname;
    let gender = Math.floor(Math.random()*2);
    return {
        surname: surname,
        name: randomGivenName(gender),
        father: father.id,
        mother: mother.id,
        gender: gender,
        children: []
    }
}
