import React, { useState } from "react";
import FlightSearchForm from "./Components/FlightSearchForm";
import { ThemeProvider } from "./Context/ThemeContext";
import { Header } from "./Components/Header";
import Lottie from "lottie-react";
import flightAnimation from "./Assets/Animations/flight-animation.json";
import { useTheme } from "./Context/ThemeContext";
import { ComingSoon } from "./Components/ComingSoon";
import { FlightDeals } from "./Components/FlightDeals";

type Section = "Explore" | "Flights" | "Hotels" | "Holiday Homes" | "Things to do";

function AppContent() {
	const { theme } = useTheme();
	const isDark = theme === "dark";
	const [activeSection, setActiveSection] = useState<Section>("Flights");

	return (
		<div className={`min-h-screen pb-10 ${isDark ? "bg-[#1a1d24]" : "bg-gray-50"}`}>
			<Header activeSection={activeSection} onSectionChange={setActiveSection} />

			{activeSection === "Flights" ? (
				<main className='pt-16'>
					{/* Hero Section */}
					<div className='min-h-[calc(100vh-4rem)] flex flex-col'>
						{/* Background Animation */}
						<div className='h-[40vh] md:h-[50vh] relative overflow-hidden'>
							<Lottie animationData={flightAnimation} loop={true} className='w-full h-full object-cover' />
							{/* Gradient Overlay */}
							<div
								className={`absolute inset-0 bg-gradient-to-b ${
									isDark
										? "from-transparent via-[#1a1d24]/50 to-[#1a1d24]"
										: "from-transparent via-gray-50/50 to-gray-50"
								}`}
							/>
						</div>

						{/* Content */}
						<div className='flex-1 -mt-24 z-10'>
							<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
								<h1
									className={`text-3xl md:text-4xl font-bold ${
										isDark ? "text-white" : "text-gray-900"
									} text-center mb-8`}>
									Flights
								</h1>
								<FlightSearchForm />
								<FlightDeals />
							</div>
						</div>
					</div>
				</main>
			) : (
				<main className='pt-16'>
					<ComingSoon />
				</main>
			)}
		</div>
	);
}

function App() {
	return (
		<ThemeProvider>
			<AppContent />
		</ThemeProvider>
	);
}

export default App;
