export type University = {
  id: string;
  name: string;
  country: string;
};

export type UniversitiesResponse = {
  universities: University[];
  hasMore: boolean;
};

export type UniversitiesParams = {
  search?: string;
  limit?: number;
  offset?: number;
};

