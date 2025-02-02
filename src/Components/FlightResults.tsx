import React from "react";
import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";
import { ArrowRight, Info, Plane } from "lucide-react";
import { type Flight } from "../Services/flightService";

interface FlightResultsProps {
	flights: Flight[];
	isLoading: boolean;
	error?: string;
}

export const FlightResults: React.FC<FlightResultsProps> = ({ flights, isLoading, error }) => {
	const { theme } = useTheme();
	const isDark = theme === "dark";

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
			<div className='mt-8'>
				<div className={`p-4 rounded-lg ${isDark ? "bg-red-900/50 text-red-200" : "bg-red-50 text-red-500"}`}>
					<p>{error}</p>
				</div>
			</div>
		);
	}

	if (!flights?.length) {
		return (
			<div className='mt-8'>
				<div className={`p-4 rounded-lg ${isDark ? "bg-gray-800 text-gray-300" : "bg-gray-50 text-gray-600"}`}>
					<p>No flights found. Try different search criteria.</p>
				</div>
			</div>
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

	return (
		<div className='mt-8 space-y-4'>
			{flights.map((flight) => (
				<motion.div
					key={flight.id}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className={`p-6 rounded-lg ${
						isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-50"
					} shadow-lg transition-colors`}>
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
								<div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>
									{flight.legs[0].stopCount === 0
										? "Direct"
										: `${flight.legs[0].stopCount} stop${flight.legs[0].stopCount > 1 ? "s" : ""}`}
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
				</motion.div>
			))}
		</div>
	);
};
