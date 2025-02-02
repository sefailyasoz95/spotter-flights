import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "../Context/ThemeContext";
import { Minus, Plus } from "lucide-react";

interface PassengerCount {
	adults: number;
	children: number;
	infants: number;
}

interface PassengerSelectProps {
	isOpen: boolean;
	onClose: () => void;
	passengers: PassengerCount;
	onChange: (passengers: PassengerCount) => void;
}

export const PassengerSelect: React.FC<PassengerSelectProps> = ({ isOpen, onClose, passengers, onChange }) => {
	const { theme } = useTheme();
	const isDark = theme === "dark";

	const handleChange = (type: keyof PassengerCount, value: number) => {
		const newPassengers = { ...passengers };

		// Apply the change
		newPassengers[type] = Math.max(0, value);

		// Ensure at least one adult
		if (type === "adults") {
			newPassengers.adults = Math.max(1, newPassengers.adults);
		}

		// Calculate total passengers
		const total = newPassengers.adults + newPassengers.children + newPassengers.infants;

		// Only apply changes if within limits
		if (total <= 9 && newPassengers.infants <= newPassengers.adults) {
			onChange(newPassengers);
		}
	};

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -10 }}
			className={`absolute top-full left-0 right-0 mt-2 p-4 rounded-lg shadow-lg z-50 ${
				isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
			}`}>
			{/* Adults */}
			<div className='flex items-center justify-between mb-4'>
				<div>
					<div className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>Adults</div>
					<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Age 12+</div>
				</div>
				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={() => handleChange("adults", passengers.adults - 1)}
						className={`p-1 rounded-full ${
							isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
						} transition-colors disabled:opacity-50`}
						disabled={passengers.adults <= 1}>
						<Minus className='w-4 h-4' />
					</button>
					<span className={`w-6 text-center ${isDark ? "text-gray-200" : "text-gray-700"}`}>{passengers.adults}</span>
					<button
						type='button'
						onClick={() => handleChange("adults", passengers.adults + 1)}
						className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
						disabled={getTotalPassengers() >= 9}>
						<Plus className='w-4 h-4' />
					</button>
				</div>
			</div>

			{/* Children */}
			<div className='flex items-center justify-between mb-4'>
				<div>
					<div className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>Children</div>
					<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Ages 2-11</div>
				</div>
				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={() => handleChange("children", passengers.children - 1)}
						className={`p-1 rounded-full ${
							isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
						} transition-colors disabled:opacity-50`}
						disabled={passengers.children <= 0}>
						<Minus className='w-4 h-4' />
					</button>
					<span className={`w-6 text-center ${isDark ? "text-gray-200" : "text-gray-700"}`}>{passengers.children}</span>
					<button
						type='button'
						onClick={() => handleChange("children", passengers.children + 1)}
						className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
						disabled={getTotalPassengers() >= 9}>
						<Plus className='w-4 h-4' />
					</button>
				</div>
			</div>

			{/* Infants */}
			<div className='flex items-center justify-between'>
				<div>
					<div className={`font-medium ${isDark ? "text-gray-200" : "text-gray-700"}`}>Infants</div>
					<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Under 2</div>
				</div>
				<div className='flex items-center gap-3'>
					<button
						type='button'
						onClick={() => handleChange("infants", passengers.infants - 1)}
						className={`p-1 rounded-full ${
							isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"
						} transition-colors disabled:opacity-50`}
						disabled={passengers.infants <= 0}>
						<Minus className='w-4 h-4' />
					</button>
					<span className={`w-6 text-center ${isDark ? "text-gray-200" : "text-gray-700"}`}>{passengers.infants}</span>
					<button
						type='button'
						onClick={() => handleChange("infants", passengers.infants + 1)}
						className={`p-1 rounded-full ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors`}
						disabled={passengers.infants >= passengers.adults || getTotalPassengers() >= 9}>
						<Plus className='w-4 h-4' />
					</button>
				</div>
			</div>

			<div className={`mt-4 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
				* Maximum 9 passengers per booking
				<br />* Maximum 1 infant per adult
			</div>
		</motion.div>
	);

	function getTotalPassengers() {
		return passengers.adults + passengers.children + passengers.infants;
	}
};
