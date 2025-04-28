import { Component, HostListener, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SearchService } from '../service/search.service';
import { Router } from '@angular/router';
import { FavoriteService } from '../service/favorite.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  searchText: string = '';
  constructor(private searchService: SearchService,private favService:FavoriteService) {}
  router = inject(Router);
  dataFromSearch: any[] = [];
  private debounceTimer: any;
  isDropDownOpen!: boolean; // Flag to track dropdown state
  favoritesCount:any | '0';

  ngOnInit() {
  this.favService.favorites$.subscribe((favorites: any[]) => {
      this.favoritesCount = favorites; // Update the favorites count whenever it changes
  console.log(this.favoritesCount); // Log the updated count to the console
    } );
   
  }


  onSearch() {
    this.searchService.getTvShowData(this.searchText).subscribe({
      next: (data: any) => {
        //
        this.dataFromSearch = data.Search;

        this.isDropDownOpen = this.isBoolean(data.Response); // Open dropdown if there are results
      },
      error: (error: any) => {
        console.error('Error fetching data:', error); // Log any errors that occur during the API call
      },
    });
    this.searchText = ''; // Clear the input field after search
  }

  isBoolean(value: string): boolean {
    if (value === 'True' || value == 'true') {
      return true; // Return true if the value is 'true'
    } else if (value == 'false' || value === 'False') {
      return false; // Return false if the value is 'false'
    }
    return false; // Default return value if input is neither 'true' nor 'false'
  }

  onSearchTextChange(value: string) {
    this.searchText = value; // Update the search text as the user types

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer); // Clear the previous timer if it exists
    }

    this.debounceTimer = setTimeout(() => {
      this.onSearch(); // Call the search function after a delay we may reduce time
    }, 3000);
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.isDropDownOpen = false;
    }
  }

  onSelect(imdbIDformData: any) {
    this.router.navigate(['/details', imdbIDformData.imdbID]);
  }
}
