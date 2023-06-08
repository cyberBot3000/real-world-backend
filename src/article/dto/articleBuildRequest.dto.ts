import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { ArticleCreateDto } from './articleCreate.dto';

export class ArticleBuildRequestDto {
  @ApiProperty({ type: ArticleCreateDto })
  @ValidateNested()
  article: ArticleCreateDto;
}
