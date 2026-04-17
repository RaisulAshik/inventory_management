import {
  Controller,
  Get,
  Patch,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ProfileService } from './profile.service';
import { UpdateProfileDto, UpdatePreferencesDto } from './dto/update-profile.dto';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';

const IMAGE_MIME_RE = /^image\/(jpeg|png|gif|webp|svg\+xml)$/;

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  /**
   * GET /profile
   * Get own tenant profile
   */
  @Get()
  @ApiOperation({ summary: 'Get tenant profile' })
  async getProfile(@CurrentUser() user: JwtPayload) {
    const profile = await this.profileService.getProfile(user.tenantId);
    return { data: profile };
  }

  /**
   * PATCH /profile
   * Update company info
   */
  @Patch()
  @ApiOperation({ summary: 'Update company info' })
  async updateProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateProfileDto,
  ) {
    const profile = await this.profileService.updateProfile(user.tenantId, dto);
    return { data: profile };
  }

  /**
   * PATCH /profile/preferences
   * Update system preferences (timezone, dateFormat, currency, fiscalYear)
   */
  @Patch('preferences')
  @ApiOperation({ summary: 'Update system preferences' })
  async updatePreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdatePreferencesDto,
  ) {
    const profile = await this.profileService.updatePreferences(user.tenantId, dto);
    return { data: profile };
  }

  /**
   * POST /profile/logo
   * Upload company logo
   */
  @Post('logo')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
      fileFilter: (_req, file, cb) => {
        if (!IMAGE_MIME_RE.exec(file.mimetype)) {
          return cb(new BadRequestException('Only image files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  @ApiOperation({ summary: 'Upload company logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async uploadLogo(
    @CurrentUser() user: JwtPayload,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No file uploaded');

    // Store as base64 data URL (no external storage needed)
    const base64 = file.buffer.toString('base64');
    const logoUrl = `data:${file.mimetype};base64,${base64}`;

    const profile = await this.profileService.updateLogo(user.tenantId, logoUrl);
    return { data: { logoUrl: profile.logoUrl } };
  }
}
