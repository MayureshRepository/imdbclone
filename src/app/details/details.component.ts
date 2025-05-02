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
      this.snackBar.open('Item added to favorites', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: ['my-snackbar'],
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
    (event.target as HTMLImageElement).src = '/no-image.jpg';
  }

  removeFromFavorites(ids: string) {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }
    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      if (this.favoriteFromLocalStorage[i] == ids) {
        this.favoriteService.removeFavorite(ids);
        this.snackBar.open('Item is removed from  favorites', 'Close', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'end',
          panelClass: ['my-snackbar'],
        });
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

    this.isSelectedMovieInFavorites = this.isMovieAlreadyInFavorites(ids);
  }
}
