import { IsString, IsNumber, Min, Max } from 'class-validator';

export class CreateReportDto {
  @Min(0)
  @Max(100000000)
  price: string;

  @IsString()
  make: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(1930)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsNumber()
  //   @IsLatLong()
  lng: number;

  @IsNumber()
  //   @IsLatitude()
  lat: number;

  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;
}
