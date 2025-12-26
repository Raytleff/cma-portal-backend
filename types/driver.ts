
export interface CreateDriverDto {
  userId: string;
  callSign?: string;
  address?: string;
  contactNumber?: string;
  carAssignment: "GROUP_A" | "GROUP_B" | "DAILY" | "TRUCK";
  spouseName?: string;
  spouseContact?: string;
  sssNumber?: string;
  philhealthNumber?: string;
  pagibigNumber?: string;
  licenseImageUrl?: string;
  licenseNumber?: string;
  licenseExpiry?: Date;
}
  
export interface UpdateDriverDto extends Partial<CreateDriverDto> {}