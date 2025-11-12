export interface LegalContentResponse {
  success: boolean;
  data: {
    content: string;
    lastUpdated?: string;
  };
}

export interface HelpSupportItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface HelpSupportResponse {
  success: boolean;
  data: {
    items: HelpSupportItem[];
  };
}

