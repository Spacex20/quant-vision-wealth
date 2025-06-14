
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ScreenerCriteria } from "./useStockScreener";
import { useState } from "react";

type Saved = { name: string; criteria: ScreenerCriteria };

export function SavedScreeners({
  onLoad,
  getCurrentCriteria
}: {
  onLoad: (criteria: ScreenerCriteria) => void;
  getCurrentCriteria: () => ScreenerCriteria;
}) {
  const [saved, setSaved] = useState<Saved[]>(
    () => {
      const raw = localStorage.getItem("savedScreeners");
      return raw ? JSON.parse(raw) : [];
    }
  );
  const { toast } = useToast();
  const [newName, setNewName] = useState("");

  const save = () => {
    if (!newName) {
      toast({ title: "Please name your screener" });
      return;
    }
    const criteria = getCurrentCriteria();
    const updated = [...saved, { name: newName, criteria }];
    setSaved(updated);
    localStorage.setItem("savedScreeners", JSON.stringify(updated));
    setNewName("");
    toast({ title: "Screening criteria saved" });
  };

  const remove = (name: string) => {
    const updated = saved.filter(s => s.name !== name);
    setSaved(updated);
    localStorage.setItem("savedScreeners", JSON.stringify(updated));
    toast({ title: "Screening criteria deleted" });
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 items-end">
        <input
          className="border rounded p-2 mr-2"
          placeholder="Name your screener"
          value={newName}
          onChange={e => setNewName(e.target.value)}
        />
        <Button
          size="sm"
          variant="outline"
          onClick={save}
        >Save Criteria</Button>
      </div>
      {saved.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {saved.map(s => (
            <div key={s.name} className="bg-muted rounded px-2 py-1 flex gap-2 items-center">
              <Button size="sm" variant="ghost" onClick={() => onLoad(s.criteria)}>
                {s.name}
              </Button>
              <Button size="sm" variant="destructive" onClick={() => remove(s.name)}>
                ×
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
