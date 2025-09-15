import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export function ModeToggle() {
  const { theme, toggleTheme } = useAuthStore();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="hover-glow btn-press border-border/50 bg-glass"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}