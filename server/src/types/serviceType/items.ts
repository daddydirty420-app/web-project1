export type ItemPageMode = 
| "normal"
| "draft"
| "confirm"
| "deleted";

export type FormDataMode = 
| "normal"
| "draft"
| "edit";

export type ItemIdParams = {
    itemId: number;
};