import {
  Controller,
  Post,
  Get,
  Delete,
  UseGuards,
  Body,
  Headers,
  UsePipes,
  Param,
  Put,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { ArticleService } from '@app/article/article.service';
import { AuthGuard } from '@app/auth/guard/auth.guard';
import { ApiBody, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
import { ArticleBuildResponseDto } from '@app/article/dto/articleBuildResponse.dto';
import { ArticleUpdateDto } from '@app/article/dto/articleUpdate.dto';
import { parseQueryParams } from './article.helper';
import { Token } from '@app/auth/iterface/auth.interface';
import { IArtilceQueryParamsOptional } from './interface/query.interface';
import { ArticleBuildResponseFeedDto } from './dto/articleBuildResponseFeed.dto';
import { CustomValidationPipe } from '@app/common/common.pipe';
import { ArticleRequestCreateDto } from './dto/articleRequestCreate.dto';
import { ArticleRequestUpdateDto } from './dto/articleRequestUpdate.dto';

@ApiTags('articles')
@Controller('articles')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiCreatedResponse({ type: ArticleBuildResponseFeedDto })
  @UsePipes(new CustomValidationPipe())
  async getArticleAll(
    @Headers('Authorization') token: Token,
    @Query() query: IArtilceQueryParamsOptional,
  ): Promise<ArticleBuildResponseFeedDto> {
    const params = parseQueryParams(query);
    return await this.articleService.getArticleAllByParamsAndToken(
      params,
      token,
    );
  }

  @UseGuards(AuthGuard)
  @Get('feed')
  @ApiCreatedResponse({ type: ArticleBuildResponseFeedDto })
  @UsePipes(new CustomValidationPipe())
  async getArticleFeed(
    @Headers('Authorization') token: Token,
    @Query() query: IArtilceQueryParamsOptional,
  ): Promise<ArticleBuildResponseFeedDto> {
    const params = parseQueryParams(query);
    return await this.articleService.getArticleFolowByParamsAndToken(
      params,
      token,
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBody({ type: ArticleRequestCreateDto })
  @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  @UsePipes(CustomValidationPipe)
  async createArticle(
    @Headers('Authorization') auth: string | undefined,
    @Body() articleCreateDto: ArticleRequestCreateDto,
  ): Promise<ArticleBuildResponseDto> {
    return await this.articleService.createArticle(articleCreateDto, auth);
  }

  @Get(':slug')
  @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  @UsePipes(new CustomValidationPipe())
  async getArticleBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<ArticleBuildResponseDto> {
    return await this.articleService.getArticleBySlugAndToken(slug, auth);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug')
  @UsePipes(new CustomValidationPipe())
  async deleteArticleBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<void> {
    return await this.articleService.deleteArticleBySlugAndToken(slug, auth);
  }

  @UseGuards(AuthGuard)
  @Put(':slug')
  @ApiBody({ type: ArticleRequestUpdateDto })
  @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  @UsePipes(new ValidationPipe())
  async updateArticleBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
    @Body('article') articleUpdatedDto: ArticleUpdateDto,
  ): Promise<ArticleBuildResponseDto> {
    return await this.articleService.updateArticleBySlugAndToken(
      slug,
      articleUpdatedDto,
      auth,
    );
  }

  @UseGuards(AuthGuard)
  @Post(':slug/favorite')
  @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  @UsePipes(new CustomValidationPipe())
  async addFavoriteBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<ArticleBuildResponseDto> {
    return await this.articleService.addToFavoritesBySlugAndToken(slug, auth);
  }

  @UseGuards(AuthGuard)
  @Delete(':slug/favorite')
  @ApiCreatedResponse({ type: ArticleBuildResponseDto })
  @UsePipes(new CustomValidationPipe())
  async deleteFavoriteBySlug(
    @Headers('Authorization') auth: string | undefined,
    @Param('slug') slug: string,
  ): Promise<ArticleBuildResponseDto> {
    return await this.articleService.deleteFromFavoritesBySlugAndToken(
      slug,
      auth,
    );
  }
}
