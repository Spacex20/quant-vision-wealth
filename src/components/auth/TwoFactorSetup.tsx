
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Shield, QrCode, Key } from "lucide-react";

export function TwoFactorSetup() {
  const [step, setStep] = useState<'setup' | 'qr' | 'verify'>('setup');
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEnable2FA = async () => {
    setLoading(true);
    try {
      const { data, error } = await authService.enableTwoFactor();
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else if (data) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setBackupCodes(data.backupCodes);
        setStep('qr');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to enable two-factor authentication.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    setLoading(true);
    try {
      // In a real implementation, you'd get the challenge ID from the setup process
      const challengeId = "mock-challenge-id";
      const { error } = await authService.verifyTwoFactor(verificationCode, challengeId);
      
      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "2FA Enabled",
          description: "Two-factor authentication has been successfully enabled."
        });
        setStep('setup');
        setVerificationCode("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify two-factor authentication.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Two-Factor Authentication
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {step === 'setup' && (
          <Button 
            onClick={handleEnable2FA}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Setting up..." : "Enable Two-Factor Authentication"}
          </Button>
        )}
        
        {step === 'qr' && (
          <div className="space-y-4">
            <div className="text-center">
              <QrCode className="h-8 w-8 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Scan this QR code with your authenticator app
              </p>
            </div>
            
            {qrCode && (
              <div className="flex justify-center">
                <img src={qrCode} alt="2FA QR Code" className="border rounded" />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Manual Entry Key</Label>
              <Input value={secret} readOnly className="font-mono text-xs" />
            </div>
            
            <div className="space-y-2">
              <Label>Backup Codes (Save these securely)</Label>
              <div className="grid grid-cols-2 gap-1 text-xs font-mono">
                {backupCodes.map((code, index) => (
                  <div key={index} className="p-1 bg-muted rounded">
                    {code}
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              onClick={() => setStep('verify')}
              className="w-full"
            >
              Continue to Verification
            </Button>
          </div>
        )}
        
        {step === 'verify' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="2fa-code">Enter Verification Code</Label>
              <Input
                id="2fa-code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code from your app"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setStep('qr')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleVerify2FA}
                disabled={!verificationCode || loading}
                className="flex-1"
              >
                {loading ? "Verifying..." : "Complete Setup"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
