
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, X } from "lucide-react";

type TourStep = {
  selector: string; // CSS selector
  title: string;
  content: string;
  placement?: "top" | "right" | "bottom" | "left";
};

const TOUR_KEY = "onboarding_v1_completed";

const steps: TourStep[] = [
  {
    selector: "#mainNavbarTabs",
    title: "Explore Everything",
    content: "Jump between Builder, Analytics, Simulator, and more via these tabs. Try them all for a full experience!",
    placement: "bottom",
  },
  {
    selector: "#personalizedFab",
    title: "Get Custom Stock Ideas",
    content: "This magic button gives you AI-powered personalized recommendations—don’t miss out!",
    placement: "left",
  },
  {
    selector: "#dashboardHeader",
    title: "Account & Profile",
    content: "See your account, edit your preferences, and access user actions from the dashboard header.",
    placement: "bottom",
  },
  {
    selector: "#communityTab",
    title: "Join the Community",
    content: "Connect with other investors in real-time chat, share insights, and grow your network.",
    placement: "top",
  },
];

type TourContextType = {
  startTour: () => void;
  inProgress: boolean;
};

const TourContext = createContext<TourContextType | undefined>(undefined);

export function useOnboardingTour() {
  return useContext(TourContext)!;
}

// Nice animated tooltip "bubble"
function TourTooltip({
  anchorRect,
  step,
  onNext,
  onClose,
  isLast,
}: {
  anchorRect: DOMRect | null;
  step: TourStep;
  onNext: () => void;
  onClose: () => void;
  isLast: boolean;
}) {
  if (!anchorRect) return null;

  // Calculate placement
  let style: React.CSSProperties = {
    position: "absolute",
    zIndex: 99999,
    maxWidth: 320,
    minWidth: 200,
    transition: "all 0.4s cubic-bezier(.33,1,.68,1)",
    boxShadow: "0 8px 32px 0 rgba(60,60,120,.24)",
  };
  const spacing = 14; // px gap from anchor
  switch (step.placement) {
    case "top":
      style.left = anchorRect.left + anchorRect.width / 2 - 160;
      style.top = anchorRect.top - spacing - 110;
      break;
    case "right":
      style.left = anchorRect.right + spacing;
      style.top = anchorRect.top;
      break;
    case "bottom":
      style.left = anchorRect.left + anchorRect.width / 2 - 160;
      style.top = anchorRect.bottom + spacing;
      break;
    case "left":
      style.left = anchorRect.left - 340;
      style.top = anchorRect.top;
      break;
    default:
      style.left = anchorRect.right + spacing;
      style.top = anchorRect.top;
  }

  // Bubble Arrow (only for top/bottom)
  let arrow = null;
  if (step.placement === "top" || step.placement === "bottom") {
    arrow = (
      <div
        className={`absolute left-1/2 -translate-x-1/2 ${step.placement === "top" ? "bottom-0" : "top-0"}`}
        style={{ height: 0, width: 0 }}
      >
        <div
          style={{
            borderLeft: "12px solid transparent",
            borderRight: "12px solid transparent",
            borderTop: step.placement === "top" ? "12px solid #282c41" : undefined,
            borderBottom: step.placement === "bottom" ? "12px solid #282c41" : undefined,
          }}
        />
      </div>
    );
  }

  return (
    <div
      className="
        animate-fade-in
        bg-gradient-to-br from-blue-800 via-purple-700 to-fuchsia-700
        text-white
        rounded-2xl p-5 pt-6 relative
        shadow-2xl select-none
        border-2 border-white"
      style={style}
    >
      {arrow}
      <div className="absolute right-4 top-3">
        <button onClick={onClose}>
          <X className="w-5 h-5 text-white/80 hover:text-white" />
        </button>
      </div>
      <div className="flex items-center gap-2 mb-2 font-extrabold text-lg">
        <Sparkles className="w-5 h-5 text-yellow-300 animate-bounce" />
        {step.title}
      </div>
      <div className="mb-4 text-sm text-white/90">{step.content}</div>
      <div className="flex gap-2 justify-end">
        <Button variant="secondary" size="sm" onClick={onClose}>
          Skip
        </Button>
        <Button variant="default" size="sm" onClick={onNext}>
          {isLast ? "Finish" : "Next"}
          <ArrowRight className="ml-1 w-4 h-4 animate-pulse" />
        </Button>
      </div>
    </div>
  );
}

export function OnboardingTourProvider({ children }: { children: React.ReactNode }) {
  const [inProgress, setInProgress] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  // Automatically show if not completed
  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      setTimeout(() => setInProgress(true), 800);
    }
  }, []);

  useEffect(() => {
    if (!inProgress) return;
    // Find the element for this step
    const selector = steps[stepIdx]?.selector;
    if (selector) {
      const el = document.querySelector(selector) as HTMLElement;
      if (el) {
        const rect = el.getBoundingClientRect();
        setAnchorRect(rect);

        // Optional: highlight it with a pulsing ring (for accessibility/emphasis)
        el.classList.add("ring-4", "ring-fuchsia-400", "ring-offset-2", "animate-pulse");
        return () => {
          el.classList.remove("ring-4", "ring-fuchsia-400", "ring-offset-2", "animate-pulse");
        };
      } else {
        setAnchorRect(null);
      }
    }
  }, [inProgress, stepIdx]);

  const handleNext = () => {
    if (stepIdx < steps.length - 1) {
      setStepIdx(idx => idx + 1);
    } else {
      setInProgress(false);
      setStepIdx(0);
      localStorage.setItem(TOUR_KEY, "DONE");
    }
  };

  const handleClose = () => {
    setInProgress(false);
    setStepIdx(0);
    localStorage.setItem(TOUR_KEY, "DONE");
  };

  const startTour = () => {
    setInProgress(true);
    setStepIdx(0);
  };

  return (
    <TourContext.Provider value={{ startTour, inProgress }}>
      {children}
      {inProgress && steps[stepIdx] && (
        <TourTooltip
          anchorRect={anchorRect}
          step={steps[stepIdx]}
          onNext={handleNext}
          onClose={handleClose}
          isLast={stepIdx === steps.length - 1}
        />
      )}
    </TourContext.Provider>
  );
}
