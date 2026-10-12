import { revalidatePath } from "next/cache";

export function revalidatePostPages(slug?: string) {
  revalidatePath("/");
  revalidatePath("/posts");
  revalidatePath("/admin");
  revalidatePath("/admin/posts");

  if (slug) {
    revalidatePath(`/posts/${slug}`);
  }
}