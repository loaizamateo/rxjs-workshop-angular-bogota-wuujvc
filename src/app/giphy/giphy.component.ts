import { Component } from "@angular/core";
import { GiphyService } from "./giphy.service";
import { Observable } from "rxjs";

import {
  API_SEARCH_URL,
  DEFAULT_SEARCH_TERM,
  API_KEY,
  DEFAULT_SEARCH_LIMIT
} from "./giphy.config";
import { Gif, GiphyResponse } from "./giphy.model";

@Component({
  selector: "app-giphy",
  templateUrl: "./giphy.component.html",
  styleUrls: ["./giphy.component.css"]
})
export class GiphyComponent {
  searchTerm$: Observable<string> = this.giphyService.searchTerm$
  limit : number = DEFAULT_SEARCH_LIMIT;
  gifs: Gif[];
  gifs$ : Observable<Gif[]> = this.giphyService.gifs$
  totalResults$ : Observable<number>= this.giphyService.totalResults$

  totalPages$: Observable<number> = this.giphyService.totalPages$

  actualPage$ = this.giphyService.actualPage$

  constructor(private giphyService: GiphyService) {
    this.giphyService.giphyResponse$.subscribe(
      (response: GiphyResponse) => (this.gifs = response.data)
    );
  }

  movePage(num: number){
    this.giphyService.movePage(num)
  }

  changeSearchTerm(term :string){
    this.giphyService.changeSearchTerm(term);
  }

  changeLimit(limit: number){
    this.giphyService.changeLimit(limit)
  }
}
