// Component props interfaces
export interface CrawlInputProps {
  onSubmit: (message: string) => void;
  initialValue?: string;
}

export interface CrawlDisplayProps {
  message: string;
  isPlaying: boolean;
  onComplete?: () => void;
}
