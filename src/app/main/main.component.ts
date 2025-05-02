import { Component, inject, OnInit } from '@angular/core';
import { SearchService } from '../service/search.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { GetmoviedataService } from '../service/getmoviedata.service';
import { FavoriteService } from '../service/favorite.service';

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
  favoriteFromLocalStorage: any[] = [];
  dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  isSelectedMovieInFavorites: boolean = false;

  constructor(
    private searchService: SearchService,
    private getmovieData: GetmoviedataService,
    private favoriteService: FavoriteService
  ) {}
  ngOnInit(): void {
    this.getlatestMovies();
    this.getCachedMovies();
    this.favoriteService.getFavorites();
  }

  getlatestMovies() {
    this.isLoading = true;
    this.searchService.getTvShowData('marvel').subscribe({
      next: (data: any) => {
        this.trendingMovies = data.Search;

        this.isLoading = false;
        this.trendingMovies.forEach((movie: any) => {
          if (this.isMovieAlreadyInFavorites(movie.imdbID)) {
            movie.isAddedToFav = true;
          } else {
            movie.isAddedToFav = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        this.isLoading = false;
      },
    });
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
    (event.target as HTMLImageElement).src = 'no-image.jpg';
  }

  checkIfMovieIsInFavorites(ids: string): boolean {
    return this.isMovieAlreadyInFavorites(ids);
  }
}
