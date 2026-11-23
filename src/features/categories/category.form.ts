// FormData转业务数据
export function getCategoryFormData(formData: FormData) {
  return {
    name: String(formData.get("name") || ""),
    slug: String(formData.get("slug") || ""),
  };
}