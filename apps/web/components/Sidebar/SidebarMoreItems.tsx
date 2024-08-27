import { useAuth } from "@/app/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Menu } from "lucide-react";
import { useTheme } from "next-themes";

const SidebarMoreItems = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div>
          <div className="flex gap-4 items-center rounded hover:cursor-pointer">
            <Menu />
            <span>More</span>
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[10rem]">
        <DropdownMenuLabel>More</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {theme === "light" && (
            <span onClick={() => setTheme("dark")}>Dark mode</span>
          )}
          {theme === "dark" && (
            <span onClick={async () => setTheme("light")}>Light mode</span>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => logout()}
          className="mt-3 bg-destructive text-destructive-foreground"
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default SidebarMoreItems;
