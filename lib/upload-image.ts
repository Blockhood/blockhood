import { supabase } from "@/lib/supabase";

const allowedExtensions = ["png", "jpg", "jpeg", "webp"];

export async function uploadImage(file: File, pathPrefix: string = "") {
  const fileExt = file.name.split(".").pop()?.toLowerCase();

  if (!fileExt || !allowedExtensions.includes(fileExt)) {
    throw new Error(
      "File formats are not supported. Only PNG, JPG, JPEG, WEBP."
    );
  }

  const fileName = `${Date.now()}.${fileExt}`;
  const filePath = `${pathPrefix}${fileName}`;

  const { error } = await supabase.storage
    .from("uploads")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) throw error;

  const { data: publicUrlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(filePath);

  return publicUrlData.publicUrl;
}
