import { Association, DataTypes, Model } from "sequelize";
import sequelize from "../db.js";

export class Permit extends Model {
    declare id: number;

    declare permit_number: number | null;
    declare permit_type: string | null;
    declare issued_at: Date | null;
    declare expired_at: Date | null;

    declare createdAt: Date;
    declare updatedAt: Date;
}

export default Permit;