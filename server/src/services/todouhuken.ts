import { TodouhukenOption } from "../models/index.js";

type TodouhukenIdParams = {
    todouhukenId: number;
};

export const getTodouhuken = ({ todouhukenId }: TodouhukenIdParams) => {
    return TodouhukenOption.findByPk(todouhukenId);
};

export const getAllTodouhuken = () => {
    return TodouhukenOption.findAll();
};
