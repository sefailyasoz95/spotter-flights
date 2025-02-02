import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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
	onChange: (newPassengers: PassengerCount) => void;
}

export function PassengerSelect({ isOpen, onClose, passengers, onChange }: PassengerSelectProps) {
	const { theme } = useTheme();
	const isDark = theme === "dark";

	const updatePassengers = (type: keyof PassengerCount, increment: boolean) => {
		const newPassengers = { ...passengers };
		if (increment) {
			if (type === "adults" && newPassengers.adults < 9) {
				newPassengers.adults += 1;
			} else if (type === "children" && newPassengers.children < 9) {
				newPassengers.children += 1;
			} else if (type === "infants" && newPassengers.infants < 4) {
				newPassengers.infants += 1;
			}
		} else {
			if (type === "adults" && newPassengers.adults > 1) {
				newPassengers.adults -= 1;
			} else if (type === "children" && newPassengers.children > 0) {
				newPassengers.children -= 1;
			} else if (type === "infants" && newPassengers.infants > 0) {
				newPassengers.infants -= 1;
			}
		}
		onChange(newPassengers);
	};

	const CounterButton = ({
		onClick,
		icon: Icon,
		disabled,
	}: {
		onClick: () => void;
		icon: typeof Plus | typeof Minus;
		disabled?: boolean;
	}) => (
		<motion.button
			whileHover={disabled ? {} : { scale: 1.1 }}
			whileTap={disabled ? {} : { scale: 0.9 }}
			onClick={onClick}
			disabled={disabled}
			className={`p-1.5 rounded-full transition-colors ${
				disabled
					? `${isDark ? "text-gray-600" : "text-gray-300"} cursor-not-allowed`
					: `${isDark ? "text-gray-400 hover:text-gray-200" : "text-gray-600 hover:text-gray-800"}`
			}`}>
			<Icon className='w-4 h-4' />
		</motion.button>
	);

	return (
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className='fixed inset-0 z-40'
					/>

					{/* Dropdown panel */}
					<motion.div
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -10 }}
						className={`absolute right-0 mt-2 w-72 rounded-lg shadow-lg z-50 ${
							isDark ? "bg-[#1e2330] border border-gray-700" : "bg-white border border-gray-200"
						}`}>
						<div className='divide-y divide-gray-700'>
							{/* Adults */}
							<div className='p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Adults</p>
										<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Age 12+</p>
									</div>
									<div className='flex items-center space-x-4'>
										<CounterButton
											icon={Minus}
											onClick={() => updatePassengers("adults", false)}
											disabled={passengers.adults <= 1}
										/>
										<span
											className={`text-sm font-medium min-w-[1ch] text-center ${
												isDark ? "text-white" : "text-gray-900"
											}`}>
											{passengers.adults}
										</span>
										<CounterButton
											icon={Plus}
											onClick={() => updatePassengers("adults", true)}
											disabled={passengers.adults >= 9}
										/>
									</div>
								</div>
							</div>

							{/* Children */}
							<div className='p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Children</p>
										<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Ages 2-11</p>
									</div>
									<div className='flex items-center space-x-4'>
										<CounterButton
											icon={Minus}
											onClick={() => updatePassengers("children", false)}
											disabled={passengers.children <= 0}
										/>
										<span
											className={`text-sm font-medium min-w-[1ch] text-center ${
												isDark ? "text-white" : "text-gray-900"
											}`}>
											{passengers.children}
										</span>
										<CounterButton
											icon={Plus}
											onClick={() => updatePassengers("children", true)}
											disabled={passengers.children >= 9}
										/>
									</div>
								</div>
							</div>

							{/* Infants */}
							<div className='p-4'>
								<div className='flex items-center justify-between'>
									<div>
										<p className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>Infants</p>
										<p className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>Under 2</p>
									</div>
									<div className='flex items-center space-x-4'>
										<CounterButton
											icon={Minus}
											onClick={() => updatePassengers("infants", false)}
											disabled={passengers.infants <= 0}
										/>
										<span
											className={`text-sm font-medium min-w-[1ch] text-center ${
												isDark ? "text-white" : "text-gray-900"
											}`}>
											{passengers.infants}
										</span>
										<CounterButton
											icon={Plus}
											onClick={() => updatePassengers("infants", true)}
											disabled={passengers.infants >= 4}
										/>
									</div>
								</div>
							</div>

							{/* Info section */}
							<div className='p-4'>
								<div className={`text-xs space-y-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
									<p>• Maximum 9 passengers per booking</p>
									<p>• Maximum 4 infants per booking</p>
								</div>
							</div>
						</div>
					</motion.div>
				</>
			)}
		</AnimatePresence>
	);
}
