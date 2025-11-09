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
  onComplete?: () => void;
}

