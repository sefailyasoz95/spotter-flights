import React, { useState, useMemo } from "react";
import { useTheme } from "../Context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Info, Plane, ChevronDown, ChevronUp, Clock, DollarSign } from "lucide-react";
import { type Flight } from "../Services/flightService";

interface FlightResultsProps {
	flights?: Flight[];
	isLoading: boolean;
	error?: string;
}

type SortOption = "price" | "duration" | "default";

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0 },
};

export const FlightResults: React.FC<FlightResultsProps> = ({ flights, isLoading, error }) => {
	const { theme } = useTheme();
	const isDark = theme === "dark";
	const [expandedFlights, setExpandedFlights] = useState<Set<string>>(new Set());
	const [sortBy, setSortBy] = useState<SortOption>("default");

	const sortedFlights = useMemo(() => {
		if (!flights) return [];

		const flightsCopy = [...flights];

		switch (sortBy) {
			case "price":
				return flightsCopy.sort((a, b) => a.price.raw - b.price.raw);
			case "duration":
				return flightsCopy.sort((a, b) => a.legs[0].durationInMinutes - b.legs[0].durationInMinutes);
			default:
				return flightsCopy;
		}
	}, [flights, sortBy]);

	const toggleFlightDetails = (flightId: string) => {
		const newExpanded = new Set(expandedFlights);
		if (newExpanded.has(flightId)) {
			newExpanded.delete(flightId);
		} else {
			newExpanded.add(flightId);
		}
		setExpandedFlights(newExpanded);
	};

	if (isLoading) {
		return (
			<div className='mt-8'>
				<div className='animate-pulse space-y-4'>
					{[1, 2, 3].map((i) => (
						<div key={i} className={`h-32 ${isDark ? "bg-gray-800" : "bg-gray-100"} rounded-lg`} />
					))}
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mt-8'>
				<div className={`p-4 rounded-lg ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-500"}`}>
					<p>{error}</p>
				</div>
			</motion.div>
		);
	}

	if (flights && !flights?.length) {
		return (
			<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className='mt-8'>
				<div className={`p-4 rounded-lg ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"}`}>
					<p>No flights found. Try different search criteria.</p>
				</div>
			</motion.div>
		);
	}

	const formatTime = (dateString: string) => {
		return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
	};

	const formatDuration = (minutes: number) => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours}h ${mins}m`;
	};

	const formatStopDuration = (arrival: string, nextDeparture: string) => {
		const arrivalTime = new Date(arrival);
		const departureTime = new Date(nextDeparture);
		const durationInMinutes = (departureTime.getTime() - arrivalTime.getTime()) / (1000 * 60);
		return formatDuration(durationInMinutes);
	};

	return (
		<div className='mt-8'>
			{/* Sorting Controls */}
			<div className='mb-4 flex items-center justify-between'>
				<div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
					{flights?.length || 0} {(flights?.length || 0) === 1 ? "flight" : "flights"} found
				</div>
				<div className='flex gap-2'>
					<button
						onClick={() => setSortBy("default")}
						className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
							sortBy === "default"
								? isDark
									? "bg-blue-500 text-white"
									: "bg-blue-500 text-white"
								: isDark
								? "bg-gray-700 text-gray-300 hover:bg-gray-600"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						Best match
					</button>
					<button
						onClick={() => setSortBy("price")}
						className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
							sortBy === "price"
								? isDark
									? "bg-blue-500 text-white"
									: "bg-blue-500 text-white"
								: isDark
								? "bg-gray-700 text-gray-300 hover:bg-gray-600"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						<DollarSign className='w-4 h-4' />
						Price
					</button>
					<button
						onClick={() => setSortBy("duration")}
						className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
							sortBy === "duration"
								? isDark
									? "bg-blue-500 text-white"
									: "bg-blue-500 text-white"
								: isDark
								? "bg-gray-700 text-gray-300 hover:bg-gray-600"
								: "bg-gray-100 text-gray-600 hover:bg-gray-200"
						}`}>
						<Clock className='w-4 h-4' />
						Duration
					</button>
				</div>
			</div>

			{/* Flight Results */}
			<motion.div variants={container} initial='hidden' animate='show' className='space-y-4'>
				{sortedFlights.map((flight, index) => (
					<motion.div
						key={flight.id}
						variants={item}
						layout
						className={`p-6 rounded-lg ${
							isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
						} shadow-lg transition-colors cursor-pointer`}
						onClick={() => toggleFlightDetails(flight.id)}>
						<div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-6'>
							{/* Airline Info */}
							<div className='flex items-center gap-4'>
								{flight.legs[0].carriers.marketing[0].logoUrl && (
									<img
										src={flight.legs[0].carriers.marketing[0].logoUrl}
										alt={flight.legs[0].carriers.marketing[0].name}
										className='w-8 h-8 object-contain'
									/>
								)}
								<span className={`font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
									{flight.legs[0].carriers.marketing[0].name}
								</span>
							</div>

							{/* Flight Times */}
							<div className='flex items-center gap-6'>
								<div className='text-center'>
									<div className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
										{formatTime(flight.legs[0].departure)}
									</div>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										{flight.legs[0].origin.displayCode}
									</div>
								</div>

								<div className='flex flex-col items-center min-w-[120px]'>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										{formatDuration(flight.legs[0].durationInMinutes)}
									</div>
									<div className='relative w-full h-px bg-gray-300 my-2'>
										<Plane className='absolute -top-2 -right-2 w-4 h-4 text-blue-500' />
									</div>
									<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"} flex items-center gap-1`}>
										{flight.legs[0].stopCount === 0 ? (
											"Direct"
										) : (
											<>
												{`${flight.legs[0].stopCount} stop${flight.legs[0].stopCount > 1 ? "s" : ""}`}
												{expandedFlights.has(flight.id) ? (
													<ChevronUp className='w-3 h-3' />
												) : (
													<ChevronDown className='w-3 h-3' />
												)}
											</>
										)}
									</div>
								</div>

								<div className='text-center'>
									<div className={`text-lg font-semibold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
										{formatTime(flight.legs[0].arrival)}
									</div>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
										{flight.legs[0].destination.displayCode}
									</div>
								</div>
							</div>

							{/* Price */}
							<div className='flex flex-col items-end gap-2'>
								<div className={`text-2xl font-bold ${isDark ? "text-gray-200" : "text-gray-800"}`}>
									{flight.price.formatted}
								</div>
								{flight.tags?.includes("cheapest") && (
									<div className='flex items-center gap-1 text-green-500 text-sm'>
										<Info className='w-4 h-4' />
										<span>Best price</span>
									</div>
								)}
							</div>
						</div>

						{/* Stop Details */}
						<AnimatePresence>
							{expandedFlights.has(flight.id) && flight.legs[0].stopCount > 0 && (
								<motion.div
									initial={{ opacity: 0, height: 0 }}
									animate={{ opacity: 1, height: "auto" }}
									exit={{ opacity: 0, height: 0 }}
									className='mt-6 pt-4 border-t border-gray-200'>
									<div className={`text-sm font-medium mb-4 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
										Flight Details:
									</div>
									<div className='space-y-6'>
										{flight.legs[0].segments.map((segment, index) => (
											<div key={segment.id} className='relative'>
												{index > 0 && (
													<div className={`mb-4 px-4 py-2 rounded ${isDark ? "bg-gray-700" : "bg-gray-100"}`}>
														<div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
															Layover in {segment.origin.parent?.name || segment.origin.name}:{" "}
															{formatStopDuration(flight.legs[0].segments[index - 1].arrival, segment.departure)}
														</div>
													</div>
												)}
												<div className='flex items-start gap-4'>
													<div className='flex-shrink-0'>
														<div className='w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500'>
															{index + 1}
														</div>
													</div>
													<div className='flex-grow'>
														<div className='grid grid-cols-3 gap-4'>
															<div>
																<div className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
																	{formatTime(segment.departure)}
																</div>
																<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
																	{segment.origin.parent?.name || segment.origin.name} ({segment.origin.displayCode})
																</div>
															</div>
															<div className='text-center'>
																<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
																	{formatDuration(segment.durationInMinutes)}
																</div>
																<div className='relative w-full h-px bg-gray-300 my-2'>
																	<Plane className='absolute -top-2 -right-2 w-4 h-4 text-blue-500' />
																</div>
																<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
																	Flight {segment.flightNumber}
																</div>
															</div>
															<div className='text-right'>
																<div className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}>
																	{formatTime(segment.arrival)}
																</div>
																<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
																	{segment.destination.parent?.name || segment.destination.name} (
																	{segment.destination.displayCode})
																</div>
															</div>
														</div>
														<div className={`mt-2 text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
															Operated by {segment.operatingCarrier.name}
														</div>
													</div>
												</div>
												{index < flight.legs[0].segments.length - 1 && (
													<div className='absolute left-4 top-12 bottom-0 w-px bg-gray-300' />
												)}
											</div>
										))}
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</motion.div>
				))}
			</motion.div>
		</div>
	);
};
