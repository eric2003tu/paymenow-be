export class CreateUserDto {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  maritalStatus: string;
  nationalId: string;
}

export class UpdateUserDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  maritalStatus?: string;
  profilePicture?: string;
}
