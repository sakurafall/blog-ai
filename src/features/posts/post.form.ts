export function getPostFormData(formData: FormData) {
  return {
    title: String(formData.get("title") || ""),
    slug: String(formData.get("slug") || ""),
    categoryId: Number(formData.get("categoryId")),
    description: String(formData.get("description") || ""),
    content: String(formData.get("content") || ""),
    published: formData.get("published") === "on",
  };
}