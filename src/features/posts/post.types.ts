export type PostFormData = {
  id?: number;
  title?: string;
  slug?: string;
  categoryId?: string[];
  description?: string;
  content?: string;
  published?: boolean;
};

export type PostListItem = {
  id: number;
  slug: string;
  title: string;
  description: string;
  categoryId?: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  content: string;
};