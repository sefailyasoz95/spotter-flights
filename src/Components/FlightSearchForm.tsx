import React, { useState, useRef, useEffect } from "react";
import { ArrowRightLeft, Search, Users, ArrowLeftRight } from "lucide-react";
import { DatePicker } from "./DatePicker";
import { useTheme } from "../Context/ThemeContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./Select";
import { motion, AnimatePresence } from "framer-motion";
import { PassengerSelect } from "./PassengerSelect";
import { useOnClickOutside } from "../Hooks/useOnClickOutside";
import { toast } from "sonner";
import { FlightResults } from "./FlightResults";
import { type Flight } from "../Services/flightService";
import { flightService } from "../Services/flightService";
import { useDebounce } from "../Hooks/useDebounce";

interface PassengerCount {
	adults: number;
	children: number;
	infants: number;
}

interface Airport {
	id: string;
	name: string;
	displayCode: string;
	city: string;
	parent?: {
		id: string;
		name: string;
		displayCode: string;
		type: string;
	};
}

interface FlightSearchFormProps {
	onSearch: (flights: any[]) => void;
	setIsLoading: (loading: boolean) => void;
	setError: (error: string | undefined) => void;
}

const FlightSearchForm = ({ onSearch, setIsLoading, setError }: FlightSearchFormProps) => {
	const { theme } = useTheme();
	const [tripType, setTripType] = useState<"roundTrip" | "oneWay">("roundTrip");
	const [from, setFrom] = useState("");
	const [to, setTo] = useState("");
	const [cabinClass, setCabinClass] = useState("Economy");
	const [departDate, setDepartDate] = useState<Date>();
	const [returnDate, setReturnDate] = useState<Date>();
	const [isPassengerSelectOpen, setIsPassengerSelectOpen] = useState(false);
	const [isCabinClassOpen, setIsCabinClassOpen] = useState(false);
	const [passengers, setPassengers] = useState<PassengerCount>({
		adults: 1,
		children: 0,
		infants: 0,
	});
	const [localLoading, setLocalLoading] = useState(false);
	const [localError, setLocalError] = useState<string | undefined>();
	const [fromSuggestions, setFromSuggestions] = useState<Airport[]>([]);
	const [toSuggestions, setToSuggestions] = useState<Airport[]>([]);
	const [selectedFrom, setSelectedFrom] = useState<Airport | null>(null);
	const [selectedTo, setSelectedTo] = useState<Airport | null>(null);

	const passengerSelectRef = useRef<HTMLDivElement>(null);
	const cabinClassRef = useRef<HTMLDivElement>(null);

	const debouncedFromQuery = useDebounce(from, 300);
	const debouncedToQuery = useDebounce(to, 300);

	useOnClickOutside(passengerSelectRef, () => setIsPassengerSelectOpen(false));
	useOnClickOutside(cabinClassRef, () => setIsCabinClassOpen(false));

	const isDark = theme === "dark";

	const formatDate = (date: Date) => {
		return date.toISOString().split("T")[0];
	};

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

	const validateDates = (date: Date) => {
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const selectedDate = new Date(date);
		selectedDate.setHours(0, 0, 0, 0);
		return selectedDate >= today;
	};

	useEffect(() => {
		const searchAirports = async () => {
			if (debouncedFromQuery.length >= 2) {
				try {
					const airports = await flightService.searchAirports(debouncedFromQuery);
					setFromSuggestions(airports);
				} catch (error) {
					console.error("Error searching airports:", error);
					setFromSuggestions([]);
				}
			} else {
				setFromSuggestions([]);
			}
		};

		searchAirports();
	}, [debouncedFromQuery]);

	useEffect(() => {
		const searchAirports = async () => {
			if (debouncedToQuery.length >= 2) {
				try {
					const airports = await flightService.searchAirports(debouncedToQuery);
					setToSuggestions(airports);
				} catch (error) {
					console.error("Error searching airports:", error);
					setToSuggestions([]);
				}
			} else {
				setToSuggestions([]);
			}
		};

		searchAirports();
	}, [debouncedToQuery]);

	const handleFromSearch = (value: string) => {
		setFrom(value);
	};

	const handleToSearch = (value: string) => {
		setTo(value);
	};

	const handleSearch = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedFrom || !selectedTo || !departDate) {
			toast.error("Please fill in all required fields");
			return;
		}

		setLocalLoading(true);
		setLocalError(undefined);
		setIsLoading(true);
		setError(undefined);

		try {
			const flights = await flightService.searchFlights({
				origin: selectedFrom,
				destination: selectedTo,
				departureDate: departDate.toISOString().split("T")[0],
				returnDate: returnDate?.toISOString().split("T")[0],
				adults: passengers.adults,
				children: passengers.children,
				infants: passengers.infants,
				cabinClass: "ECONOMY",
			});

			onSearch(flights);
		} catch (error: any) {
			setLocalError(error.message);
			setError(error.message);
			toast.error(error.message);
		} finally {
			setLocalLoading(false);
			setIsLoading(false);
		}
	};

	const handleSwap = () => {
		setFrom(to);
		setTo(from);
		setSelectedFrom(selectedTo);
		setSelectedTo(selectedFrom);
		setFromSuggestions([]);
		setToSuggestions([]);
	};
	console.log("fromSuggestions: ", fromSuggestions);

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className={`${isDark ? "bg-[#2a2f3a]" : "bg-white"} rounded-xl shadow-2xl max-w-4xl mx-auto`}>
			<form onSubmit={handleSearch}>
				{/* Trip Type Selection */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}>
					{/* Trip Type Buttons */}
					<div className='grid grid-cols-2 gap-2 mb-4'>
						<motion.button
							type='button'
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
							type='button'
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

					{/* Passenger and Class Selection */}
					<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
						<div className='relative' ref={passengerSelectRef}>
							<button
								onClick={() => setIsPassengerSelectOpen(!isPassengerSelectOpen)}
								className={`w-full py-2.5 px-4 rounded-lg text-sm text-left flex items-center justify-between ${
									isDark
										? "bg-[#1e2330] text-gray-300 hover:bg-[#252b3b]"
										: "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
									isDark
										? "bg-[#1e2330] text-gray-300 hover:bg-[#252b3b]"
										: "bg-gray-50 text-gray-600 hover:bg-gray-100"
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
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 }}
							className='relative'>
							<label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>From</label>
							<input
								type='text'
								value={from}
								onChange={(e) => handleFromSearch(e.target.value)}
								placeholder='City or airport'
								className={`w-full bg-transparent border-b ${
									isDark
										? "border-gray-600 hover:border-gray-400 text-gray-200 placeholder-gray-500"
										: "border-gray-300 hover:border-gray-400 text-gray-800 placeholder-gray-400"
								} focus:border-blue-500 outline-none text-sm py-2.5 transition-colors`}
							/>
							{fromSuggestions?.length > 0 && (
								<div
									className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
										isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
									}`}>
									{fromSuggestions.map((airport) => (
										<button
											key={airport.id}
											type='button'
											className={`w-full text-left px-4 py-2 text-sm ${
												isDark ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-700"
											}`}
											onClick={() => {
												setFrom(`${airport.city || airport.name} (${airport.displayCode})`);
												setSelectedFrom(airport);
												setFromSuggestions([]);
											}}>
											<div className='flex flex-col'>
												<span className='font-medium'>{airport.city || airport.name}</span>
												<span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
													{airport.name} ({airport.displayCode})
												</span>
												{airport.parent && (
													<span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
														{airport.parent.name}
													</span>
												)}
											</div>
										</button>
									))}
								</div>
							)}
						</motion.div>

						<motion.button
							type='button'
							initial={{ opacity: 0, scale: 0 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ delay: 0.6 }}
							whileHover={{ scale: 1.1, rotate: 180 }}
							whileTap={{ scale: 0.9 }}
							onClick={handleSwap}
							className={`hidden md:block p-2 rounded-full transition-colors ${
								isDark ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-600"
							}`}>
							<ArrowLeftRight className='w-4 h-4' />
						</motion.button>

						<motion.div
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.5 }}
							className='relative'>
							<label className={`block text-xs mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>To</label>
							<input
								type='text'
								value={to}
								onChange={(e) => handleToSearch(e.target.value)}
								placeholder='City or airport'
								className={`w-full bg-transparent border-b ${
									isDark
										? "border-gray-600 hover:border-gray-400 text-gray-200 placeholder-gray-500"
										: "border-gray-300 hover:border-gray-400 text-gray-800 placeholder-gray-400"
								} focus:border-blue-500 outline-none text-sm py-2.5 transition-colors`}
							/>
							{toSuggestions?.length > 0 && (
								<div
									className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg ${
										isDark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
									}`}>
									{toSuggestions.map((airport) => (
										<button
											key={airport.id}
											type='button'
											className={`w-full text-left px-4 py-2 text-sm ${
												isDark ? "hover:bg-gray-700 text-gray-200" : "hover:bg-gray-100 text-gray-700"
											}`}
											onClick={() => {
												setTo(`${airport.city || airport.name} (${airport.displayCode})`);
												setSelectedTo(airport);
												setToSuggestions([]);
											}}>
											<div className='flex flex-col'>
												<span className='font-medium'>{airport.city || airport.name}</span>
												<span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
													{airport.name} ({airport.displayCode})
												</span>
												{airport.parent && (
													<span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
														{airport.parent.name}
													</span>
												)}
											</div>
										</button>
									))}
								</div>
							)}
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
						type='submit'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.8 }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						disabled={localLoading}
						className={`w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm 
								 font-medium flex items-center justify-center space-x-2 transition-colors
								 ${localLoading ? "opacity-50 cursor-not-allowed" : ""}`}>
						<Search className='w-4 h-4' />
						<span>{localLoading ? "Searching..." : "Search Flights"}</span>
					</motion.button>
				</motion.div>
			</form>
		</motion.div>
	);
};

export default FlightSearchForm;
