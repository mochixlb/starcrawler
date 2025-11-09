// Component props interfaces
export interface CrawlInputProps {
  onSubmit: (data: CrawlData) => void;
  initialData?: CrawlData;
}

export interface CrawlData {
  openingText: string;
  logoText: string;
  episodeNumber: string;
  episodeSubtitle: string;
  crawlText: string;
}

export interface CrawlDisplayProps {
  crawlData: CrawlData;
  isPlaying: boolean;
  isPaused?: boolean;
  speed?: number;
  onComplete?: () => void;
  onProgressChange?: (progress: number, elapsed: number, remaining: number) => void;
  seekTo?: number; // Progress value 0-1 to seek to
  isLooping?: boolean;
}

