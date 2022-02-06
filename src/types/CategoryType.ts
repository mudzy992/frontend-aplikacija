import ArticleType from "./ArticleType";

export default class CategoryType {
    /* ovdje definišemo tipove (tj. podatke), koji su nam neuphodni
    za frontend iz backend-a. Podaci koje želimo prikazati na frontend-u */
    /* ako stavimo upitnik u nazivu nekog polja u typescript, time kažemo da
    to polje ne mora biti inicializovano (nije obavezno) */
    /* ovaj type ne mora da preslikava niti bazu podataka, niti entitet i DTO u backend-u */
    categoryId?: number;
    name?: string;
    image?:string;
    items?: ArticleType[]
}