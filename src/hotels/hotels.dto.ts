import { IsNotEmpty, IsOptional } from "class-validator";

export class HotelInputCreate {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    address: string;
    @IsNotEmpty()
    imageURL: string;
    @IsNotEmpty()
    telephone: string;
    @IsOptional()
    detail: string;
}

export class HotelInputUpdate{
    name?: string 
    address?: string
    imageURL?: string 
    telephone?: string
    detail?: string 
}