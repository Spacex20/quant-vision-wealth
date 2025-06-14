
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface SocialLoginButtonProps {
  provider: 'google' | 'apple' | 'linkedin' | 'twitter' | 'discord';
  onLogin: () => Promise<any>;
  icon: React.ReactNode;
  label: string;
}

export function SocialLoginButton({ provider, onLogin, icon, label }: SocialLoginButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const { error } = await onLogin();
      if (error) {
        console.error(`${provider} login error:`, error);
      }
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogin}
      disabled={loading}
      className="w-full flex items-center gap-2"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        icon
      )}
      {loading ? 'Connecting...' : label}
    </Button>
  );
}
