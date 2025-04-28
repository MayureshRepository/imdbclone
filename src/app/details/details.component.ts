import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { windowWhen } from 'rxjs';
import { GetmoviedataService } from '../service/getmoviedata.service';
import { GettvshowdataService } from '../service/gettvshowdata.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  isLoading: boolean = false; // Flag to indicate loading state
  favoriteFromLocalStorage: any[] = []; // Array to hold favorite items from local storage
  dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  isSelectedMovieInFavorites: boolean = false; // Flag to indicate if the movie is in favorites
  @ViewChild('celebration', { static: false })
  celebrationContainer!: ElementRef;
  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.ids = idParam;
      }
    });

    //Here we are adding a Session Storage for Recently added or viewed movies
    const storedMovies = sessionStorage.getItem('recentlyViewedMovies');
    const recentlyAddedMovies = storedMovies
      ? JSON.parse(storedMovies)
      : [];

    if (!recentlyAddedMovies.includes(this.ids)) {
      recentlyAddedMovies.push(this.ids);
      sessionStorage.setItem(
        'recentlyViewedMovies',
        JSON.stringify(recentlyAddedMovies)
      );
    }

    // Fetch movie details using the ID

    this.getDetails(this.ids); // Call the getDetails method with the ID
  }

  getDetails(id: string) {
    this.isLoading = true; // Set loading state to true
    this.movieSearchService.getMovieData(id).subscribe({
      next: (data: any) => {
        this.tvshow = data; // Assign the received data to the tvshow property
        this.isSelectedMovieInFavorites = this.isMovieAlreadyInFavorites(id); // Check if the movie is already in favorites
      },
      error: (error: any) => {
        console.error('Error fetching data:', error); // Log any errors that occur during the API call
      },
      complete: () => {
        this.isLoading = false; // Set loading state to false when the request is complete
      },
    });
  }

  addToFavorites(ids: any) {
    // Get current favorites from localStorage or initialize an empty array
    const storedFavorites = localStorage.getItem('favorites');
    this.favoriteFromLocalStorage = storedFavorites
      ? JSON.parse(storedFavorites)
      : [];

    // Check if the item is already in favorites
    const isAlreadyFavorite = this.favoriteFromLocalStorage.includes(ids);
    if (isAlreadyFavorite) {
      this.snackBar.open('Item is already in favorites', 'Close', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'end',
        panelClass: ['my-snackbar'],
      });

      return; // Exit if the item is already a favorite
    }

    // Avoid duplicates (optional)
    if (!isAlreadyFavorite) {
      this.favoriteFromLocalStorage.push(ids);
      localStorage.setItem(
        'favorites',
        JSON.stringify(this.favoriteFromLocalStorage)
      );

      this.isSelectedMovieInFavorites = this.isMovieAlreadyInFavorites(ids);
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

  isAddedToFavorites() {
    // Implement logic to check if the item is already in favorites
    return false; // Placeholder return value
  }

  removeFromFavorites(ids: string) {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }
    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      if (this.favoriteFromLocalStorage[i] == ids) {
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
