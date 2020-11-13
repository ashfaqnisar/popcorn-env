import { Module } from '@nestjs/common'
import { TraktModule } from '@pct-org/services/trakt'
import { ShowsService } from '@pct-org/types/show'

import { ShowsResolver } from './shows.resolver'

import { SeasonsService } from '../seasons/seasons.service'
import { DownloadsService } from '../downloads/downloads.service'

@Module({
  imports: [
    TraktModule,
  ],
  providers: [
    ShowsResolver,
    ShowsService,
    SeasonsService,
    DownloadsService
  ]
})
export class ShowsModule {
}
