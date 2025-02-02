import React from "react";
import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";
import { ArrowRight, Info, Plane } from "lucide-react";

interface Flight {
	airline: {
		name: string;
		logo: string;
	};
	departure: {
		time: string;
		airport: string;
	};
	arrival: {
		time: string;
		airport: string;
	};
	duration: string;
	stops: number;
	price: number;
	co2Emission: {
		amount: number;
		unit: string;
		comparison: string;
	};
}

interface FlightResultsProps {
	flights: Flight[];
	isLoading?: boolean;
	onSort?: (type: string) => void;
}

export function FlightResults({ flights, isLoading, onSort }: FlightResultsProps) {
	const { theme } = useTheme();
	const isDark = theme === "dark";

	if (isLoading) {
		return (
			<div className='mt-8 space-y-4'>
				{[1, 2, 3].map((i) => (
					<div key={i} className={`h-24 rounded-lg animate-pulse ${isDark ? "bg-[#1e2330]" : "bg-gray-100"}`} />
				))}
			</div>
		);
	}

	return (
		<div className='mt-8'>
			{/* Filters and Sort */}
			<div
				className={`flex items-center gap-4 mb-4 overflow-x-auto pb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
				<button className='flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'>
					<span>All filters</span>
				</button>
				<button className='flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'>
					<span>Stops</span>
				</button>
				<button className='flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'>
					<span>Airlines</span>
				</button>
				<button className='flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'>
					<span>Times</span>
				</button>
				<button className='flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'>
					<span>Duration</span>
				</button>
				<button className='flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors hover:bg-gray-100 dark:hover:bg-gray-800'>
					<span>Emissions</span>
				</button>
			</div>

			{/* Best/Cheapest Tabs */}
			<div className='grid grid-cols-2 gap-2 mb-6'>
				<button
					className={`p-4 rounded-lg text-center transition-colors ${
						isDark ? "bg-[#1e2330] text-white hover:bg-[#252b3b]" : "bg-white text-gray-900 hover:bg-gray-50"
					} shadow-sm`}>
					<div className='text-lg font-semibold'>Best</div>
					<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
						Based on price, duration, and stops
					</div>
				</button>
				<button
					className={`p-4 rounded-lg text-center transition-colors ${
						isDark ? "bg-[#1e2330] text-white hover:bg-[#252b3b]" : "bg-white text-gray-900 hover:bg-gray-50"
					} shadow-sm`}>
					<div className='text-lg font-semibold'>Cheapest</div>
					<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Starting from $X,XXX</div>
				</button>
			</div>

			{/* Flight Results */}
			<div className='space-y-4'>
				{flights.map((flight, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className={`p-4 rounded-lg ${
							isDark ? "bg-[#1e2330] hover:bg-[#252b3b]" : "bg-white hover:bg-gray-50"
						} shadow-sm transition-colors cursor-pointer`}>
						<div className='flex items-center justify-between flex-wrap gap-4'>
							{/* Airline Info */}
							<div className='flex items-center gap-3'>
								<img src={flight.airline.logo} alt={flight.airline.name} className='w-8 h-8 object-contain' />
								<div>
									<div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{flight.airline.name}</div>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										Flight operated by {flight.airline.name}
									</div>
								</div>
							</div>

							{/* Flight Times */}
							<div className='flex items-center gap-4'>
								<div className='text-center'>
									<div className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
										{flight.departure.time}
									</div>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										{flight.departure.airport}
									</div>
								</div>
								<div className='flex flex-col items-center px-4'>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>{flight.duration}</div>
									<div className='relative w-24 h-px bg-gray-300 my-2'>
										<ArrowRight className='absolute -right-1 -top-2 w-4 h-4 text-gray-400' />
									</div>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										{flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
									</div>
								</div>
								<div className='text-center'>
									<div className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
										{flight.arrival.time}
									</div>
									<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
										{flight.arrival.airport}
									</div>
								</div>
							</div>

							{/* Price and CO2 */}
							<div className='flex flex-col items-end gap-2'>
								<div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
									${flight.price.toLocaleString()}
								</div>
								<div className='flex items-center gap-1 text-sm'>
									<span className={isDark ? "text-green-400" : "text-green-600"}>
										{flight.co2Emission.amount} {flight.co2Emission.unit}
									</span>
									<Info className='w-4 h-4 text-gray-400' />
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
