import { useTheme } from "../Context/ThemeContext";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";

interface FlightDeal {
	city: string;
	image: string;
	price: number;
	dates: string;
	duration: string;
	stops: string;
}

const deals: FlightDeal[] = [
	{
		city: "Paris",
		image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34",
		price: 4569,
		dates: "May 26 - Jun 4",
		duration: "3h 50m",
		stops: "Direct",
	},
	{
		city: "Rome",
		image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5",
		price: 3758,
		dates: "Apr 17 - Apr 23",
		duration: "2h 45m",
		stops: "1 stop",
	},
	{
		city: "Dubai",
		image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c",
		price: 4640,
		dates: "May 11 - May 17",
		duration: "4h 40m",
		stops: "Direct",
	},
	{
		city: "London",
		image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
		price: 2567,
		dates: "Mar 13 - Mar 20",
		duration: "4h 15m",
		stops: "Direct",
	},
];

export function FlightDeals() {
	const { theme } = useTheme();
	const isDark = theme === "dark";

	return (
		<div className='mt-12'>
			{/* Title Section */}
			<div className='text-center mb-8'>
				<h2 className={`text-2xl font-bold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>
					Popular Destinations from Istanbul
				</h2>
				<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
					Discover the best flight deals to capital cities
				</p>
			</div>

			{/* Deals Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
				{deals.map((deal, index) => (
					<motion.div
						key={deal.city}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: index * 0.1 }}
						className={`rounded-lg overflow-hidden ${
							isDark ? "bg-[#1e2330] hover:bg-[#252b3b]" : "bg-white hover:bg-gray-50"
						} shadow-lg transition-colors cursor-pointer group`}>
						{/* Image */}
						<div className='relative h-48 overflow-hidden'>
							<img
								src={deal.image}
								alt={deal.city}
								className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
							/>
							<div
								className={`absolute inset-0 bg-gradient-to-t ${
									isDark ? "from-[#1e2330]" : "from-black/50"
								} to-transparent`}
							/>
							<div className='absolute bottom-4 left-4 text-white'>
								<h3 className='text-xl font-bold'>{deal.city}</h3>
							</div>
						</div>

						{/* Details */}
						<div className='p-4 space-y-3'>
							{/* Price */}
							<div className='flex items-center justify-between'>
								<span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>From</span>
								<span className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
									${deal.price.toLocaleString()}
								</span>
							</div>

							{/* Flight Info */}
							<div className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
								<div className='flex items-center justify-between mb-1'>
									<span>{deal.dates}</span>
									<Plane className='w-4 h-4' />
								</div>
								<div className='flex items-center justify-between'>
									<span>{deal.duration}</span>
									<span>{deal.stops}</span>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Info Cards */}
			<div className='grid grid-cols-1 md:grid-cols-3 gap-6 mt-12'>
				{[
					{
						title: "Flexible Booking",
						description: "Change your flight with no fee up to 24 hours before departure",
					},
					{
						title: "Best Price Guarantee",
						description: "Find a lower price and we'll match it plus give you 10% off",
					},
					{
						title: "24/7 Support",
						description: "Get assistance anytime via chat, email, or phone",
					},
				].map((card, index) => (
					<motion.div
						key={card.title}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 + index * 0.1 }}
						className={`p-6 rounded-lg ${isDark ? "bg-[#1e2330]" : "bg-white"} shadow-lg`}>
						<h3 className={`text-lg font-semibold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{card.title}</h3>
						<p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>{card.description}</p>
					</motion.div>
				))}
			</div>
		</div>
	);
}
