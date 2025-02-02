import React, { useState, useRef } from "react";
import { ArrowRightLeft, Search, Users } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { useTheme } from "../Context/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { motion, AnimatePresence } from "framer-motion";
import { PassengerSelect } from "./PassengerSelect";
import { useOnClickOutside } from "../Hooks/useOnClickOutside";

interface PassengerCount {
	adults: number;
	children: number;
	infants: number;
}

const FlightSearchForm = () => {
	const { theme } = useTheme();
	const [tripType, setTripType] = useState<"roundTrip" | "oneWay">("roundTrip");
	const [cabinClass, setCabinClass] = useState("Economy");
	const [departDate, setDepartDate] = useState<Date>();
	const [returnDate, setReturnDate] = useState<Date>();
	const [isPassengerSelectOpen, setIsPassengerSelectOpen] = useState(false);
	const [passengers, setPassengers] = useState<PassengerCount>({
		adults: 1,
		children: 0,
		infants: 0,
	});

	const passengerSelectRef = useRef<HTMLDivElement>(null);
	useOnClickOutside(passengerSelectRef, () => setIsPassengerSelectOpen(false));

	const isDark = theme === "dark";

	const getTotalPassengers = () => {
		return passengers.adults + passengers.children + passengers.infants;
	};

	const getPassengerSummary = () => {
		const total = getTotalPassengers();
		const details = [];

		if (passengers.adults > 0) details.push(`${passengers.adults} Adult${passengers.adults !== 1 ? "s" : ""}`);
		if (passengers.children > 0) details.push(`${passengers.children} Child${passengers.children !== 1 ? "ren" : ""}`);
		if (passengers.infants > 0) details.push(`${passengers.infants} Infant${passengers.infants !== 1 ? "s" : ""}`);

		return `${total} Passenger${total !== 1 ? "s" : ""} (${details.join(", ")})`;
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={`${isDark ? "bg-[#2a2f3a]" : "bg-white"} rounded-xl shadow-2xl max-w-4xl mx-auto`}>
			{/* Trip Type Selection */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.2 }}
				className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
				{/* Trip Type Buttons - Full width on mobile */}
				<div className='grid grid-cols-2 gap-2 mb-4'>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setTripType("roundTrip")}
						className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
							tripType === "roundTrip"
								? `${isDark ? "bg-blue-500 text-white" : "bg-blue-500 text-white"}`
								: `${
										isDark
											? "bg-gray-800 text-gray-300 hover:bg-gray-700"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								  }`
						}`}>
						Round Trip
					</motion.button>
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						onClick={() => setTripType("oneWay")}
						className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
							tripType === "oneWay"
								? `${isDark ? "bg-blue-500 text-white" : "bg-blue-500 text-white"}`
								: `${
										isDark
											? "bg-gray-800 text-gray-300 hover:bg-gray-700"
											: "bg-gray-100 text-gray-600 hover:bg-gray-200"
								  }`
						}`}>
						One Way
					</motion.button>
				</div>

				{/* Passenger and Class Selection - Stack on mobile */}
				<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
					<div className='relative' ref={passengerSelectRef}>
						<button
							onClick={() => setIsPassengerSelectOpen(!isPassengerSelectOpen)}
							className={`w-full py-2.5 px-4 rounded-lg text-sm text-left flex items-center justify-between ${
								isDark ? "bg-[#1e2330] text-gray-300 hover:bg-[#252b3b]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
							} transition-colors`}>
							<span>{getPassengerSummary()}</span>
							<Users className='w-4 h-4 opacity-50' />
						</button>
						<PassengerSelect
							isOpen={isPassengerSelectOpen}
							onClose={() => setIsPassengerSelectOpen(false)}
							passengers={passengers}
							onChange={setPassengers}
						/>
					</div>

					<Select value={cabinClass} onValueChange={setCabinClass}>
						<SelectTrigger
							className={`w-full border-none h-[38px] px-4 ${
								isDark ? "bg-[#1e2330] text-gray-300 hover:bg-[#252b3b]" : "bg-gray-50 text-gray-600 hover:bg-gray-100"
							} transition-colors`}>
							<SelectValue placeholder='Select class' />
						</SelectTrigger>
						<SelectContent className={isDark ? "bg-[#1e2330]" : "bg-white"}>
							<SelectItem value='Economy'>Economy</SelectItem>
							<SelectItem value='Business'>Business</SelectItem>
							<SelectItem value='First'>First</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</motion.div>

			{/* Flight Search Fields */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.4 }}
				className='p-6 space-y-6'>
				<div className='grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center'>
					<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
						<label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>From</label>
						<input
							type='text'
							placeholder='Enter origin'
							className={`w-full bg-transparent border-b ${
								isDark
									? "border-gray-600 hover:border-gray-400 text-gray-200 placeholder-gray-500"
									: "border-gray-300 hover:border-gray-400 text-gray-800 placeholder-gray-400"
							} focus:border-blue-500 outline-none text-sm py-2.5 transition-colors`}
						/>
					</motion.div>

					<motion.button
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ delay: 0.6 }}
						whileHover={{ scale: 1.1, rotate: 180 }}
						whileTap={{ scale: 0.9 }}
						className={`hidden md:block p-2 rounded-full transition-colors ${
							isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
						}`}>
						<ArrowRightLeft className='w-4 h-4' />
					</motion.button>

					<motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
						<label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>To</label>
						<input
							type='text'
							placeholder='Enter destination'
							className={`w-full bg-transparent border-b ${
								isDark
									? "border-gray-600 hover:border-gray-400 text-gray-200 placeholder-gray-500"
									: "border-gray-300 hover:border-gray-400 text-gray-800 placeholder-gray-400"
							} focus:border-blue-500 outline-none text-sm py-2.5 transition-colors`}
						/>
					</motion.div>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
					<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
						<DatePicker selected={departDate} onSelect={setDepartDate} minDate={new Date()} label='Departure' />
					</motion.div>

					<AnimatePresence>
						{tripType === "roundTrip" && (
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{ duration: 0.2 }}>
								<DatePicker
									selected={returnDate}
									onSelect={setReturnDate}
									minDate={departDate || new Date()}
									label='Return'
								/>
							</motion.div>
						)}
					</AnimatePresence>
				</div>

				<motion.button
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.8 }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					className='w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm 
							 font-medium flex items-center justify-center space-x-2 transition-colors'>
					<Search className='w-4 h-4' />
					<span>Search Flights</span>
				</motion.button>
			</motion.div>
		</motion.div>
	);
};

export default FlightSearchForm;
