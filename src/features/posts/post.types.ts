export type PostFormData = {
  id?: number;
  title?: string;
  slug?: string;
  category?: string;
  description?: string;
  content?: string;
  published?: boolean;
};

export type PostListItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  content: string;
};