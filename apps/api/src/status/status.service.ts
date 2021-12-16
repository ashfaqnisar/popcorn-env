import {HttpService, Inject, Injectable} from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import * as getFolderSize from 'get-folder-size'
import {MovieModel} from '@pct-org/types/movie'
import {ShowModel} from '@pct-org/types/show'
import {EpisodeModel} from '@pct-org/types/episode'

import {Status} from './status.object-type'
import {StatusScraper} from './status-scraper.object-type'
import {ConfigService} from '../shared/config/config.service'

@Injectable()
export class StatusService {

  @InjectModel('Movies')
  private readonly movieModel: MovieModel

  @InjectModel('Shows')
  private readonly showModel: ShowModel

  @InjectModel('Episodes')
  private readonly episodesModel: EpisodeModel

  @Inject()
  private readonly configService: ConfigService

  @Inject()
  private readonly httpService: HttpService

  public async getStatus(): Promise<Status> {


    const folderSize = await this.getFolderSize()


    return {
      version: this.configService.version,
      totalMovies: await this.movieModel.countDocuments(),
      totalShows: await this.showModel.countDocuments(),
      totalEpisodes: await this.episodesModel.countDocuments(),
    }
  }

  public async getScraperStatus(): Promise<StatusScraper> {
    try {
      const response = await this.httpService.get(
        `http://localhost:${this.configService.get(ConfigService.SCRAPER_PORT)}/status`
      ).toPromise()

      return {
        version: response.data.version,
        status: response.data.status,
        updated: response.data.updated,
        nextUpdate: response.data.nextUpdate,
        uptime: response.data.uptime,
      }

    } catch (e) {
      return {
        version: 'unknown',
        status: `offline - ${e.message || e}`,
        updated: 'unknown',
        nextUpdate: 'unknown',
        uptime: 'unknown'
      }
    }
  }

  private getFolderSize(): Promise<number> {
    return new Promise((resolve) => {
      getFolderSize(this.configService.get(ConfigService.DOWNLOAD_LOCATION), (err, size) => {
        resolve(err ? 0 : size)
      })
    })
  }

}
