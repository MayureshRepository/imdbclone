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
    this.activatedRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.ids = idParam;
      }
    });

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
    const imgElement = event.target as HTMLImageElement;
    // Prevent infinite loop - only handle error once
    if (!imgElement.hasAttribute('data-error-handled')) {
      imgElement.setAttribute('data-error-handled', 'true');
      // Use a data URI instead of external file to avoid 404 errors
      imgElement.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22300%22%3E%3Crect fill=%22%23ddd%22 width=%22200%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2216%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3ENo Image%3C/text%3E%3C/svg%3E';
      imgElement.removeEventListener('error', this.onImageError.bind(this));
    }
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
