import { useState, useRef, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Calendar } from "lucide-react";
import { useTheme } from "../Context/ThemeContext";

interface DatePickerProps {
	selected?: Date;
	onSelect: (date: Date | undefined) => void;
	minDate?: Date;
	label: string;
}

export function DatePicker({ selected, onSelect, minDate, label }: DatePickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const { theme } = useTheme();
	const isDark = theme === "dark";

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	return (
		<div className='relative' ref={containerRef}>
			<label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{label}</label>
			<div className='relative'>
				<input
					type='text'
					readOnly
					value={selected ? format(selected, "EEE, MMM d") : ""}
					placeholder='Select date'
					className={`w-full bg-transparent border-b ${
						isDark
							? "border-gray-600 hover:border-gray-400 text-gray-200 placeholder-gray-500"
							: "border-gray-300 hover:border-gray-400 text-gray-800 placeholder-gray-400"
					} focus:border-blue-500 outline-none text-sm py-1.5 cursor-pointer transition-colors`}
					onClick={() => setIsOpen(!isOpen)}
				/>
				<Calendar
					className={`absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
				/>
			</div>

			{isOpen && (
				<div className='absolute z-50 mt-2 -translate-x-1/2 left-1/2 transform'>
					<div
						className={`rounded-lg shadow-xl border p-3 ${
							isDark ? "bg-[#1e2330] border-gray-700" : "bg-white border-gray-200"
						}`}>
						<DayPicker
							mode='single'
							selected={selected}
							onSelect={(date) => {
								onSelect(date);
								setIsOpen(false);
							}}
							disabled={minDate ? { before: minDate } : undefined}
							modifiers={{
								today: new Date(),
							}}
							modifiersStyles={{
								today: {
									fontWeight: "bold",
									color: "#60a5fa",
								},
								selected: {
									backgroundColor: "#2563eb",
									color: "white",
									fontWeight: "bold",
								},
							}}
							styles={{
								months: { width: "100%" },
								caption: { color: isDark ? "#e5e7eb" : "#374151" },
								head_cell: {
									color: isDark ? "#9ca3af" : "#6b7280",
									fontSize: "0.875rem",
									paddingTop: "0.5rem",
									paddingBottom: "0.5rem",
								},
								cell: {
									width: "40px",
									height: "40px",
									margin: "2px",
								},
								day: {
									margin: 0,
									width: "36px",
									height: "36px",
									fontSize: "0.875rem",
									color: isDark ? "#e5e7eb" : "#374151",
									borderRadius: "6px",
									transition: "all 0.2s",
								},
								nav: {
									display: "flex",
									justifyContent: "space-between",
									padding: "4px",
									color: isDark ? "#e5e7eb" : "#374151",
								},
								nav_button: {
									color: isDark ? "#e5e7eb" : "#374151",
									padding: "4px",
									margin: "0 4px",
								},
								nav_button_previous: {
									marginRight: "auto",
								},
								nav_button_next: {
									marginLeft: "auto",
								},
								caption_label: {
									fontSize: "0.875rem",
									fontWeight: "500",
									padding: "0.5rem",
								},
							}}
							className={isDark ? "bg-[#1e2330]" : "bg-white"}
						/>
					</div>
				</div>
			)}
		</div>
	);
}
