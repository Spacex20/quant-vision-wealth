
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authService } from "@/services/authService";
import { useToast } from "@/hooks/use-toast";
import { Phone, Shield } from "lucide-react";

export function PhoneVerification() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendCode = async () => {
    setLoading(true);
    try {
      const { error } = await authService.sendPhoneVerification(phoneNumber);
      if (error) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive"
        });
      } else {
        setStep('verify');
        toast({
          title: "Code Sent",
          description: "Please check your phone for the verification code."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send verification code.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    setLoading(true);
    try {
      const { error } = await authService.verifyPhone(phoneNumber, verificationCode);
      if (error) {
        toast({
          title: "Verification Failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified."
        });
        setStep('phone');
        setPhoneNumber("");
        setVerificationCode("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify phone number.",
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
          <Phone className="h-5 w-5" />
          Phone Verification
        </CardTitle>
        <CardDescription>
          Secure your account with phone number verification
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {step === 'phone' ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <Button 
              onClick={handleSendCode} 
              disabled={!phoneNumber || loading}
              className="w-full"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </Button>
          </>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setStep('phone')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleVerifyCode}
                disabled={!verificationCode || loading}
                className="flex-1"
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
