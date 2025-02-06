import { Moon, Sun } from "lucide-react";
import { useTheme } from "../Context/ThemeContext";

export function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();
	const isDark = theme === "dark";

	return (
		<button
			onClick={toggleTheme}
			className={`p-2 rounded-lg transition-colors ${
				isDark ? "bg-[#2a2f3a] hover:bg-[#353b47]" : "bg-white hover:bg-gray-100 shadow-md"
			}`}
			aria-label='Toggle theme'>
			{isDark ? <Sun className='h-5 w-5 text-yellow-500' /> : <Moon className='h-5 w-5 text-blue-600' />}
		</button>
	);
}
