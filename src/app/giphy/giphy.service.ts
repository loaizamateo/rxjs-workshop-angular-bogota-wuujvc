import { Injectable } from "@angular/core";
import {
  API_KEY,
  API_SEARCH_URL,
  DEFAULT_SEARCH_TERM,
  DEFAULT_SEARCH_LIMIT,
  DEFAULT_SEARCH_OFFSET
} from "./giphy.config";
import { HttpClient } from "@angular/common/http";
import {
  map,
  tap,
  switchMap,
  withLatestFrom,
  catchError
} from "rxjs/operators";
import { GiphyResponse } from "./giphy.model";
import { Observable, BehaviorSubject, combineLatest, of } from "rxjs";

const giphyUrl = `${API_SEARCH_URL}?q=${DEFAULT_SEARCH_TERM}&api_key=${API_KEY}&limit=${DEFAULT_SEARCH_LIMIT}&offset=${DEFAULT_SEARCH_OFFSET}`;

@Injectable({
  providedIn: "root"
})
export class GiphyService {
  private actualPagesBS = new BehaviorSubject(0);
  private searchTermBS = new BehaviorSubject
  (DEFAULT_SEARCH_TERM);
  private limitBS = new BehaviorSubject
  (DEFAULT_SEARCH_LIMIT);

  actualPage$ = this.actualPagesBS.asObservable();
  searchTerm$ = this.searchTermBS.asObservable();
  limit$ = this.limitBS.asObservable();

  giphyResponse$ = combineLatest([
    this.actualPage$, 
    this.searchTerm$, 
    this.limit$
    ]).pipe(
    switchMap(([actualPage, searchTerm, limit]) => 
    this.http.get(
        `${API_SEARCH_URL}?q=${searchTerm}&api_key=${API_KEY}&limit=${limit}&offset=${actualPage * limit}`
      )
    )
  )

  gifs$ = this.giphyResponse$.pipe(
    map((response: GiphyResponse)=> response.data)
  )

  totalResults$ = this.giphyResponse$.pipe(
    map((response: GiphyResponse)=> response.pagination.total_count)
  )

  totalPages$ = this.totalResults$.pipe(
    withLatestFrom(this.limit$),
    map(([totalResults, limit]) => Math.ceil 
    (totalResults / limit))
  )

  constructor(private http: HttpClient) {}

  movePage(num: number){
    this.actualPagesBS.next(this.actualPagesBS.getValue() + num);
  }

  changeSearchTerm(term: string){
    this.searchTermBS.next(term)
  }

  changeLimit(limit: number){
    this.limitBS.next(limit)
  }
}
