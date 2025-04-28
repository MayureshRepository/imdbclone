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
  trendingMovies: any[] = []; // Array to hold trending movies
  cachedMovies: any[] = []; // Array to hold cached movies
  isLoading: boolean = false; // Flag to indicate loading state
  router = inject(Router);
  favoriteFromLocalStorage: any[] = []; // Array to hold favorite items from local storage
  dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  isSelectedMovieInFavorites: boolean = false;

  constructor(
    private searchService: SearchService,
    private getmovieData: GetmoviedataService,
    private favoriteService:FavoriteService,
  ) {}
  ngOnInit(): void {
    this.getlatestMovies();
    this.getCachedMovies(); // Call the method to get cached movies
    this.favoriteService.getFavorites();
  }

  getlatestMovies() {
    this.isLoading = true; // Set loading state to true
    this.searchService.getTvShowData('marvel').subscribe({
      next: (data: any) => {
        this.trendingMovies = data.Search;

        this.isLoading = false;
        this.trendingMovies.forEach((movie: any) => {
          if (this.isMovieAlreadyInFavorites(movie.imdbID)) {
            movie.isAddedToFav = true; // Set isAddedToFav to true if the movie is already in favorites
          } else {
            movie.isAddedToFav = false;
          }
        });
      },
      error: (error: any) => {
        console.error('Error fetching data:', error); // Log any errors that occur during the API call
        this.isLoading = false;
      },
    });
  }


  getCachedMovies() {
    const storedMovies = sessionStorage.getItem('recentlyViewedMovies');
    console.log('Stored Movies:', storedMovies); // Log the stored movies
    const recentlyAddedMovies = storedMovies
      ? JSON.parse(storedMovies)
      : [];
    for (let i = 0; i < recentlyAddedMovies.length; i++) {
      this.getmovieData.getMovieData(recentlyAddedMovies[i]).subscribe({
        next: (data: any) => {
          console.log('Movie Data:', data); // Log the movie data
          this.cachedMovies.push(data); // Add the movie data to the trendingMovies array
        },
        error: (error: any) => {
          console.error('Error fetching data:', error); // Log any errors that occur during the API call
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

    // Check if the item is already in favorites
    const isAlreadyFavorite = this.favoriteFromLocalStorage.includes(data.imdbID);
    if (isAlreadyFavorite) {
      this.snackBar.open('Item is already in favorites', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: ['my-snackbar'],
      });

      return; // Exit if the item is already a favorite
    }


    this.favoriteService.addFavorite(data.imdbID);

    // Avoid duplicates (optional)
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
    // Check if the item is already in favorites
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
        this.favoriteService.removeFavorite(ids); // Remove from favorites using the service

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

  checkIfMovieIsInFavorites(ids: string): boolean {
    return this.isMovieAlreadyInFavorites(ids);
  }
}
