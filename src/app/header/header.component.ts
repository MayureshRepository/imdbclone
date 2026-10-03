import {
  Component,
  HostListener,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { SearchService } from '../service/search.service';
import { Router } from '@angular/router';
import { FavoriteService } from '../service/favorite.service';
import { ThemeService } from '../service/theme.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  searchText: string = '';
  constructor(
    private searchService: SearchService,
    private favService: FavoriteService
  ) {}
  router = inject(Router);
  theme = inject(ThemeService);
  dataFromSearch: any[] = [];
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;
  isDropDownOpen!: boolean;
  favoritesCount: any | '0';
  isLoading: boolean = false;
  ngOnInit() {
    this.favService.favorites$.subscribe((favorites: any[]) => {
      this.favoritesCount = favorites;
    });
  }

  onSearch() {
    if (!this.searchText.trim()) {
      return;
    }
    this.isLoading = false;
    this.searchService.getTvShowData(this.searchText).subscribe({
      next: (data: any) => {
        this.dataFromSearch = data.Search || [];

        this.isDropDownOpen = this.isBoolean(data.Response);
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
      },
    });
    this.searchText = '';
  }

  isBoolean(value: string): boolean {
    if (value === 'True' || value == 'true') {
      return true;
    } else if (value == 'false' || value === 'False') {
      return false;
    }
    return false;
  }

  onSearchTextChange(value: string) {
    this.searchText = value;

    if (this.debounceTimer !== null) {
      clearTimeout(this.debounceTimer);
    }

    if (!value || !value.trim()) {
      this.isDropDownOpen = false;
      this.dataFromSearch = [];
      return;
    }

    this.debounceTimer = setTimeout(() => {
      this.isDropDownOpen = true;
      this.isLoading = true;
      this.searchService.getTvShowData(this.searchText).subscribe({
        next: (data: any) => {
          this.dataFromSearch = data.Search || [];
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching data:', error);
          this.isLoading = false;
        },
      });
    }, 300);
  }

  @HostListener('document:click', ['$event'])
  handleClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.search-container')) {
      this.isDropDownOpen = false;
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = './no-image.jpg';
  }

  onSelect(imdbIDformData: any) {
    this.isDropDownOpen = false;
    this.searchText = '';
    this.router.navigate(['/details', imdbIDformData.imdbID]);
  }
}
