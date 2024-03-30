import { IsNotEmpty, IsOptional } from "class-validator";

export class HotelInputCreate {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    address: string;
    @IsOptional()
    imageURL: string;
    @IsNotEmpty()
    telephone: string;
    @IsOptional()
    detail: string;
}