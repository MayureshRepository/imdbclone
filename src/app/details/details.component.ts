import { handlePosterError } from '../shared/poster-fallback';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { windowWhen } from 'rxjs';
import { GetmoviedataService } from '../service/getmoviedata.service';
import { GettvshowdataService } from '../service/gettvshowdata.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  tvshow: any = {};
  ids!: string;
  activatedRoute = inject(ActivatedRoute);
  movieSearchService = inject(GetmoviedataService);
  isLoading: boolean = false;
  favoriteFromLocalStorage: any[] = [];
  dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  isSelectedMovieInFavorites: boolean = false;
  @ViewChild('celebration', { static: false })
  celebrationContainer!: ElementRef;
  movieName:any;

  constructor(private favoriteService: FavoriteService) {
    // Re-run on every param change so navigating between titles
    // (e.g. via header search while on a details page) refreshes the view.
    this.activatedRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam === null) {
        return;
      }
      this.ids = idParam;

      const storedMovies = sessionStorage.getItem('recentlyViewedMovies');
      const recentlyAddedMovies = storedMovies ? JSON.parse(storedMovies) : [];

      if (!recentlyAddedMovies.includes(this.ids)) {
        recentlyAddedMovies.push(this.ids);
        sessionStorage.setItem(
          'recentlyViewedMovies',
          JSON.stringify(recentlyAddedMovies)
        );
      }
      this.getDetails(this.ids);
      window.scrollTo(0, 0);
    });
  }

  get actors(): string[] {
    const actors = this.tvshow?.Actors;
    return actors && actors !== 'N/A'
      ? actors.split(',').map((a: string) => a.trim())
      : [];
  }

  get genres(): string[] {
    const genre = this.tvshow?.Genre;
    return genre && genre !== 'N/A'
      ? genre.split(',').map((g: string) => g.trim())
      : [];
  }

  getDetails(id: string) {
    this.isLoading = true;
    this.movieSearchService.getMovieData(id).subscribe({
      next: (data: any) => {
        this.tvshow = data;
        this.isSelectedMovieInFavorites = this.isMovieAlreadyInFavorites(id);
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  addToFavorites(ids: any) {
    const storedFavorites = localStorage.getItem('favorites');
    this.favoriteFromLocalStorage = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];
    const isAlreadyFavorite = this.favoriteFromLocalStorage.includes(ids);
    if (isAlreadyFavorite) {
      this.snackBar.open('Item is already in favorites', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: ['my-snackbar'],
      });
      return;
    }
    this.favoriteService.addFavorite(ids.imdbID);
    if (!isAlreadyFavorite) {
      this.favoriteFromLocalStorage.push(ids);
      this.fetchMovieName(ids, () => {
        this.snackBar.open(`${this.movieName} added to favorites`, 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'end',
          panelClass: ['my-snackbar'],
        });
      });
      localStorage.setItem(
        'favorites',
        JSON.stringify(this.favoriteFromLocalStorage)
      );
      this.isSelectedMovieInFavorites = this.isMovieAlreadyInFavorites(ids);
    }
  }

  isMovieAlreadyInFavorites(ids: any): boolean {
    const storedFavorites = localStorage.getItem('favorites');
    this.favoriteFromLocalStorage = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];

    return this.favoriteFromLocalStorage.includes(ids);
  }

  onImageError(event: Event) {
    handlePosterError(event);
  }

  removeFromFavorites(ids: string) {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }
    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      if (this.favoriteFromLocalStorage[i] == ids) {
        this.favoriteService.removeFavorite(ids);
        this.fetchMovieName(ids, () => {
          this.snackBar.open(`${this.movieName} removed from favorites`, 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'end',
            panelClass: ['my-snackbar'],
          });
        });
        this.favoriteFromLocalStorage.splice(i, 1);
        localStorage.setItem(
          'favorites',
          JSON.stringify(this.favoriteFromLocalStorage)
        );
        break;
      }
    }

    this.isSelectedMovieInFavorites = this.isMovieAlreadyInFavorites(ids);
  }

  fetchMovieName(id: any, callback?: () => void) {
    this.movieSearchService.getMovieData(id).subscribe({
      next: (data: any) => {
        this.movieName = data.Title;
        // Call the callback after movieName is set
        if (callback) {
          callback();
        }
      },
      error: (error: any) => {
        console.error('Error fetching movie name:', error);
        // Still call callback even on error
        if (callback) {
          callback();
        }
      },
    });
  }
}
