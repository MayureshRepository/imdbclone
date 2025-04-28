import { Component, inject } from '@angular/core';
import { GetmoviedataService } from '../service/getmoviedata.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.css',
})
export class FavoriteComponent {
  constructor(private dialog: MatDialog) {
    this.getFavoriteFromLocalStorage();
  }
  favoriteFromLocalStorage: any[] = []; // Array to hold favorite items from local storage
  movieSearchService = inject(GetmoviedataService);
  movieData: any[] = []; // Variable to hold movie data
  router = inject(Router);

  getFavoriteFromLocalStorage() {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }
    this.movieData = []; // Initialize movieData as an empty array
    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      this.movieSearchService
        .getMovieData(this.favoriteFromLocalStorage[i])
        .subscribe({
          next: (data: any) => {
            this.movieData.push(data); // Assign the received data to the tvshow property
          },
          error: (error: any) => {
            console.error('Error fetching data:', error); // Log any errors that occur during the API call
          },
        });
    }
  }

  onSelect(id: any) {
    this.router.navigate(['/details', id.imdbID]); // Navigate to the details page with the selected ID
  }

  //Remove Fvorite
  removeFromFavorites(idtoremove: string) {
    const favoriteFromLocalStorage1 = localStorage.getItem('favorites');
    if (favoriteFromLocalStorage1) {
      this.favoriteFromLocalStorage = JSON.parse(favoriteFromLocalStorage1);
    }
    for (var i = 0; i < this.favoriteFromLocalStorage.length; i++) {
      if (this.favoriteFromLocalStorage[i] == idtoremove) {
        this.favoriteFromLocalStorage.splice(i, 1);
        localStorage.setItem(
          'favorites',
          JSON.stringify(this.favoriteFromLocalStorage)
        );
        break;
      }
    }

    this.getFavoriteFromLocalStorage();
  }

  deleteAll() {
    this.dialog
      .open(ConfirmDialogComponent, {
        width: '500px',
        height: '300px', // or '500px', '40rem', etc.
        data: {
          title: 'Confirm Deletion',
          message: 'Are you sure you want to delete all favorites?',
        },
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          // this.clearAllFavorites(); // Call the method to clear all favorites  localStorage.removeItem('favorites');
          this.favoriteFromLocalStorage = [];
          localStorage.removeItem('favorites'); // Remove the favorites from local storage
          // Clear the array after removing from local storage
          this.movieData = []; // Clear the movieData array as well
        }
      });
  }
}
