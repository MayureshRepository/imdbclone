import { handlePosterError } from '../shared/poster-fallback';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchService } from '../service/search.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, forkJoin, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GetmoviedataService } from '../service/getmoviedata.service';
import { FavoriteService } from '../service/favorite.service';

/** Highest-rated titles from the IMDb Top 250 chart. */
const TOP_RATED_IDS = [
  'tt0111161', // The Shawshank Redemption
  'tt0068646', // The Godfather
  'tt0468569', // The Dark Knight
  'tt0071562', // The Godfather Part II
  'tt0050083', // 12 Angry Men
  'tt0167260', // The Lord of the Rings: The Return of the King
  'tt0108052', // Schindler's List
  'tt0110912', // Pulp Fiction
  'tt0120737', // The Lord of the Rings: The Fellowship of the Ring
  'tt0060196', // The Good, the Bad and the Ugly
  'tt0109830', // Forrest Gump
  'tt0137523', // Fight Club
];
const TOP_RATED_CACHE_KEY = 'topRatedMovies';
const TOP_RATED_CACHE_TTL_MS = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.css',
})
export class MainComponent implements OnInit {
  trendingMovies: any[] = [];
  cachedMovies: any[] = [];
  isLoading: boolean = false;
  router = inject(Router);
  private destroyRef = inject(DestroyRef);
  favoriteFromLocalStorage: any[] = [];
  dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  isSelectedMovieInFavorites: boolean = false;
  skeletons = Array(12);
  favoritesCount = 0;
  /** In-memory copy of favorite IDs, kept in sync by FavoriteService.favorites$. */
  private favoriteIds = new Set<string>();
  quickPicks = [
    { imdbID: 'tt1375666', Title: 'Inception' },
    { imdbID: 'tt0816692', Title: 'Interstellar' },
    { imdbID: 'tt0903747', Title: 'Breaking Bad' },
    { imdbID: 'tt0468569', Title: 'The Dark Knight' },
    { imdbID: 'tt0386676', Title: 'The Office' },
    { imdbID: 'tt1160419', Title: 'Dune' },
  ];

  get featured(): any {
    return this.trendingMovies?.[0];
  }

  scrollToTrending() {
    document.getElementById('trending')?.scrollIntoView({ behavior: 'smooth' });
  }

  focusSearch() {
    const input = document.querySelector<HTMLInputElement>('input[name="search"]');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    input?.focus();
  }

  constructor(
    private searchService: SearchService,
    private getmovieData: GetmoviedataService,
    private favoriteService: FavoriteService
  ) {}
  ngOnInit(): void {
    this.getTopRatedMovies();
    this.getCachedMovies();
    this.favoriteService.favorites$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((favorites: any[]) => {
        this.favoritesCount = favorites.length;
        this.favoriteIds = new Set(favorites);
      });
  }

  /**
   * OMDb has no "top rated" endpoint, so we look up a curated list of
   * IMDb Top 250 titles and sort them by their live IMDb rating. The result
   * is cached for a day to stay well within the API's daily request limit.
   */
  getTopRatedMovies() {
    const cached = this.readTopRatedCache();
    if (cached) {
      this.trendingMovies = cached;
      return;
    }

    this.isLoading = true;
    forkJoin(
      TOP_RATED_IDS.map((id) =>
        this.getmovieData.getMovieData(id).pipe(catchError(() => of(null)))
      )
    ).subscribe({
      next: (results: any[]) => {
        this.trendingMovies = results
          .filter((movie) => movie && movie.Response !== 'False')
          .sort((a, b) => parseFloat(b.imdbRating) - parseFloat(a.imdbRating));
        this.writeTopRatedCache(this.trendingMovies);
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      },
    });
  }

  private readTopRatedCache(): any[] | null {
    try {
      const raw = localStorage.getItem(TOP_RATED_CACHE_KEY);
      if (!raw) {
        return null;
      }
      const { savedAt, movies } = JSON.parse(raw);
      const fresh = Date.now() - savedAt < TOP_RATED_CACHE_TTL_MS;
      return fresh && movies?.length ? movies : null;
    } catch {
      return null;
    }
  }

  private writeTopRatedCache(movies: any[]) {
    if (!movies.length) {
      return;
    }
    try {
      localStorage.setItem(
        TOP_RATED_CACHE_KEY,
        JSON.stringify({ savedAt: Date.now(), movies })
      );
    } catch {
      // Storage full or unavailable; we'll just refetch next time.
    }
  }

  getCachedMovies() {
    const storedMovies = sessionStorage.getItem('recentlyViewedMovies');
    const recentlyAddedMovies = storedMovies ? JSON.parse(storedMovies) : [];
    for (let i = 0; i < recentlyAddedMovies.length; i++) {
      this.getmovieData.getMovieData(recentlyAddedMovies[i]).subscribe({
        next: (data: any) => {
          this.cachedMovies.push(data);
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
        },
      });
    }
  }
  onSelect(imdbIDformData: any) {
    this.router.navigate(['/details', imdbIDformData.imdbID]);
  }

  addtofavorite(data: any) {
    const storedFavorites = localStorage.getItem('favorites');
    this.favoriteFromLocalStorage = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];

    const isAlreadyFavorite = this.favoriteFromLocalStorage.includes(
      data.imdbID
    );
    if (isAlreadyFavorite) {
      this.snackBar.open('Item is already in favorites', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: ['my-snackbar'],
      });

      return;
    }
    this.favoriteService.addFavorite(data.imdbID);
    if (!isAlreadyFavorite) {
      this.favoriteFromLocalStorage.push(data.imdbID);
      localStorage.setItem(
        'favorites',
        JSON.stringify(this.favoriteFromLocalStorage)
      );

      this.snackBar.open(`${data.Title} Added to favorites `, 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: ['my-snackbar'],
      });
    }
  }

  isMovieAlreadyInFavorites(ids: any): boolean {
    const storedFavorites = localStorage.getItem('favorites');
    this.favoriteFromLocalStorage = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];

    return this.favoriteFromLocalStorage.includes(ids);
  }

  removeFromFavorites(ids: string) {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }

    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      if (this.favoriteFromLocalStorage[i] == ids) {
        this.favoriteService.removeFavorite(ids);

        this.favoriteFromLocalStorage.splice(i, 1);
        localStorage.setItem(
          'favorites',
          JSON.stringify(this.favoriteFromLocalStorage)
        );
        break;
      }
    }

    this.snackBar.open('Item Removed from favorites', 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'end',
      panelClass: ['my-snackbar'],
    });

    // this.toastr.success('Item Removed from favorites', 'Toastr fun!');
    this.isSelectedMovieInFavorites = this.isMovieAlreadyInFavorites(ids);
  }

  onImageError(event: Event) {
    handlePosterError(event);
  }

  // Called from the template for every card on every change detection,
  // so it must be a cheap lookup rather than a localStorage read + JSON.parse.
  checkIfMovieIsInFavorites(ids: string): boolean {
    return this.favoriteIds.has(ids);
  }
}
