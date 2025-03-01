import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { RegisterDto } from './dtos/register.dto';

@ApiTags('Auth') // Grouping the endpoints under 'Auth'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly userService: UserService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user', description: 'Registers a new user with provided details.' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation failed.' })
  @ApiBody({
    description: 'User registration payload',
    required: true,
    schema: {
      example: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'StrongPass@123'
      }
    }
  })
  async register(@Body() userData: RegisterDto) {
    return this.userService.registerUserDto(userData);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiOperation({ summary: 'User login', description: 'Logs in a user and returns an access token.' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'johndoe@example.com', description: 'User email' },
        password: { type: 'string', example: 'password123', description: 'User password' },
      },
    },
  })
  public async login(@Request() req) {
    return await this.authService.login(req.user);
  }
}
