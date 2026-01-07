import { Injectable, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: any) {
    // First validate the user
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // Generate Access Token
    const accessToken = this.jwtService.sign(
      { sub: user.id, email: user.email },
      { secret: 'ACCESS_TOKEN_SECRET', expiresIn: '15m' } // Replace with your secret
    );

    // Generate Refresh Token
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: 'REFRESH_TOKEN_SECRET', expiresIn: '7d' } // Replace with your secret
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  async register(dto: any) {
    // TODO: Check if user already exists
    // const existingUser = await this.userService.findByEmail(dto.email);
    // if (existingUser) {
    //   throw new ConflictException('User already exists');
    // }

    // Hash the password
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // TODO: Create user in database
    // const user = await this.userService.create({
    //   ...dto,
    //   password: hashedPassword,
    // });

    // For now, return a mock user (replace with actual database logic)
    const user = {
      id: 1,
      email: dto.email,
      phone: dto.phone,
      firstName: dto.firstName,
      lastName: dto.lastName,
      dateOfBirth: dto.dateOfBirth,
      maritalStatus: dto.maritalStatus,
      nationalId: dto.nationalId,
      address: dto.address,
      familyDetails: dto.familyDetails,
    };

    // Remove password from response
    const { password, ...result } = user as any;
    return result;
  }

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: Replace with actual database lookup
    // const user = await this.userService.findByEmail(email);
    const mockUser = {
      id: 1,
      email: 'test@example.com',
      password: await bcrypt.hash('password123', 10), // In real app, this would come from DB
    };

    const isPasswordValid = await bcrypt.compare(password, mockUser.password);
    if (email === mockUser.email && isPasswordValid) {
      const { password, ...result } = mockUser;
      return result;
    }
    return null;
  }
}