
	import { Controller, Post, Body, Get, Param, Patch, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
	import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';
	import { UserService } from './user.service';
	import { CreateUserDto } from './dto/create-user.dto';
	import { UpdateUserDto } from './dto/update-user.dto';
	import { UserResponseDto } from './dto/user-response.dto';
	import { FullUserResponseDto } from './dto/full-user-response.dto';

	// Placeholder AdminGuard for demonstration
	class AdminGuard {
		canActivate(context) {
			// Implement your admin check logic here
			// e.g., check user role from request
			return true;
		}
	}

@ApiTags('User')
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get('me')
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({ status: 200, type: FullUserResponseDto })
	async getMe() {
		// TODO: Replace with actual user extraction from request/session/JWT
		const userId = 'mock-user-id'; // Replace with real user ID
		return this.userService.findOne(userId);
	}

	@Post()
	@ApiOperation({ summary: 'Create a new user' })
	@ApiBody({ type: CreateUserDto })
	@ApiResponse({ status: 201, type: UserResponseDto })
	async create(@Body() dto: CreateUserDto) {
		const user = await this.userService.createUser(dto);
		return user;
	}

	@Get()
	@ApiOperation({ summary: 'Get all users' })
	@ApiResponse({ status: 200, type: [UserResponseDto] })
	async findAll() {
		return this.userService.findAll();
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get user by ID' })
	@ApiParam({ name: 'id', example: 'user-id-123' })
	@ApiResponse({ status: 200, type: FullUserResponseDto })
	async findOne(@Param('id') id: string) {
		return this.userService.findOne(id);
	}

	@Patch(':id')
	@UseGuards(AdminGuard)
	@ApiOperation({ summary: 'Update user by ID (admin only)' })
	@ApiParam({ name: 'id', example: 'user-id-123' })
	@ApiBody({ type: UpdateUserDto })
	@ApiResponse({ status: 200, type: UserResponseDto })
	async update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
		return this.userService.updateUser(id, dto);
	}

	@Delete(':id')
	@UseGuards(AdminGuard)
	@ApiOperation({ summary: 'Soft delete user by ID (admin only)' })
	@ApiParam({ name: 'id', example: 'user-id-123' })
	@ApiResponse({ status: 204 })
	@HttpCode(HttpStatus.NO_CONTENT)
	async remove(@Param('id') id: string) {
		await this.userService.softDeleteUser(id);
	}
}
