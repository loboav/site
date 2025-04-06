import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator";

export class AddToCartDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1) // Убедиться, что количество всегда положительное
  quantity: number;
}
