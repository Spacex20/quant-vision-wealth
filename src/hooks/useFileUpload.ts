
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useFileUpload(bucket = "chat-files") {
  const [uploading, setUploading] = useState(false);

  // Call with File/FileList
  async function uploadFiles(files: FileList | File[]): Promise<string[]> {
    if (!files || files.length === 0) return [];
    setUploading(true);

    // Prepare: create bucket if not exists (client can't, need to run SQL but safe to assume here)
    const urls: string[] = [];
    for (let file of Array.from(files)) {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(`${Date.now()}_${file.name}`, file, { upsert: true });
      if (error) continue;
      // Get public URL
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(data.path);
      if (pub?.publicUrl) urls.push(pub.publicUrl);
    }
    setUploading(false);
    return urls;
  }

  return { uploadFiles, uploading };
}
