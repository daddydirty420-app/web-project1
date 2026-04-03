import { TodouhukenOption } from "../models/index.js";

export const findAllTodouhuken = async () => {
    return TodouhukenOption.findAll();
};