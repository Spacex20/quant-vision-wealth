
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

// Added: icon_url (manual for now), tags, rules, guidelines, visibility
export function CreateInvestmentServerDialog({ open, setOpen, onCreated }: any) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryTags, setCategoryTags] = useState<string>("");
  const [rules, setRules] = useState("");
  const [guidelines, setGuidelines] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private" | "invite-only">("public");
  const [creating, setCreating] = useState(false);

  // NOTE: In production, use upload for icon_url. Here, a text input (a URL) for simplicity.
  const [iconUrl, setIconUrl] = useState("");

  // Handle creation
  async function handleCreate() {
    setCreating(true);
    const tagsArr = categoryTags.split(",").map(t => t.trim()).filter(Boolean);

    // Fetch current user id
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (!userData?.user) {
      setCreating(false);
      alert("You must be logged in to create a server.");
      return;
    }
    const userId = userData.user.id;

    const insertObj = {
      name,
      description,
      icon_url: iconUrl || null,
      category_tags: tagsArr.length ? tagsArr : null,
      rules: rules || null,
      guidelines: guidelines || null,
      visibility,
      created_by: userId,
    };

    const { data, error } = await supabase
      .from("investment_servers")
      .insert([insertObj]);
    setCreating(false);
    if (!error) {
      setOpen(false);
      if (onCreated) onCreated();
      setName(""); setDescription(""); setCategoryTags(""); setRules(""); setGuidelines(""); setIconUrl(""); setVisibility("public");
    } else {
      alert("Error: " + error.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Investment Server</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input placeholder="Server Name" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="Icon URL (optional)" value={iconUrl} onChange={e => setIconUrl(e.target.value)} />
          <Textarea placeholder="Short Description" value={description} onChange={e => setDescription(e.target.value)} />
          <Input placeholder="Category Tags (comma separated)" value={categoryTags} onChange={e => setCategoryTags(e.target.value)} />
          <Textarea placeholder="Rules (optional, Markdown supported)" value={rules} onChange={e => setRules(e.target.value)} />
          <Textarea placeholder="Guidelines (optional, Markdown supported)" value={guidelines} onChange={e => setGuidelines(e.target.value)} />
          <div className="flex gap-3 mt-2">
            <label className="flex items-center gap-2 text-xs">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "public"}
                onChange={() => setVisibility("public")}
              /> Public
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "private"}
                onChange={() => setVisibility("private")}
              /> Private
            </label>
            <label className="flex items-center gap-2 text-xs">
              <input
                type="radio"
                name="visibility"
                checked={visibility === "invite-only"}
                onChange={() => setVisibility("invite-only")}
              /> Invite-only
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleCreate} disabled={creating}>{creating ? "Creating..." : "Create"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

