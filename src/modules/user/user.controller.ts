import { 
  Controller, 
  UseGuards, 
  Get, 
  Request 
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from './schemas/user.schema';

@ApiTags('User') 
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth('access-token') 
  @UseGuards(JwtAuthGuard)
  @Get('user-info')
  @ApiOperation({ summary: 'Get user information', description: 'Returns the authenticated user information' })
  @ApiResponse({ status: 200, description: 'Successful response', type: User })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  public getUserInfo(@Request() req): User {
    return req.user;
  }
}
