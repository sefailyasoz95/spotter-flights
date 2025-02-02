import React, { useState } from "react";
import { useTheme } from "../Context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

type Section = "Explore" | "Flights" | "Hotels" | "Holiday Homes" | "Things to do";

interface HeaderProps {
	activeSection: Section;
	onSectionChange: (section: Section) => void;
}

const navItems: Section[] = ["Explore", "Flights", "Hotels", "Holiday Homes", "Things to do"];

export function Header({ activeSection, onSectionChange }: HeaderProps) {
	const { theme } = useTheme();
	const isDark = theme === "dark";
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleSectionChange = (section: Section) => {
		onSectionChange(section);
		setIsMobileMenuOpen(false);
	};

	return (
		<>
			<motion.header
				initial={{ y: -100 }}
				animate={{ y: 0 }}
				transition={{ type: "spring", damping: 20, stiffness: 100 }}
				className={`fixed top-0 left-0 right-0 z-50 ${
					isDark ? "bg-[#1a1d24]/80" : "bg-white/80"
				} backdrop-blur-sm border-b ${isDark ? "border-gray-800" : "border-gray-200"}`}>
				<div className='container mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='flex items-center justify-between h-16'>
						{/* Logo */}
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: 0.2 }}
							className='flex-shrink-0'>
							<span className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
								Spotter Flights
							</span>
						</motion.div>

						{/* Desktop Navigation */}
						<nav className='hidden md:flex items-center space-x-1'>
							{navItems.map((item, index) => (
								<motion.button
									key={item}
									initial={{ opacity: 0, y: -20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 * (index + 3) }}
									onClick={() => handleSectionChange(item)}
									className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
										item === activeSection
											? `${isDark ? "text-white bg-[#2a2f3a]" : "text-gray-900 bg-gray-100"}`
											: `${
													isDark
														? "text-gray-300 hover:text-white hover:bg-[#2a2f3a]"
														: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
											  }`
									}`}
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}>
									{item}
								</motion.button>
							))}
						</nav>

						{/* Right section */}
						<div className='flex items-center space-x-4'>
							<ThemeToggle />
							{/* Mobile menu button */}
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
								className='md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 focus:outline-none'>
								{isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
							</motion.button>
						</div>
					</div>
				</div>
			</motion.header>

			{/* Mobile menu */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => setIsMobileMenuOpen(false)}
							className='fixed inset-0 bg-black/50 z-40 md:hidden'
						/>

						{/* Menu panel */}
						<motion.div
							initial={{ x: "100%" }}
							animate={{ x: 0 }}
							exit={{ x: "100%" }}
							transition={{ type: "spring", damping: 25, stiffness: 200 }}
							className={`fixed right-0 top-0 bottom-0 w-64 z-50 ${
								isDark ? "bg-[#1a1d24]" : "bg-white"
							} md:hidden shadow-xl`}>
							<div className='flex flex-col h-full'>
								<div className='flex justify-end p-4'>
									<motion.button
										whileHover={{ scale: 1.05 }}
										whileTap={{ scale: 0.95 }}
										onClick={() => setIsMobileMenuOpen(false)}
										className={`p-2 rounded-lg ${
											isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-700"
										}`}>
										<X className='h-6 w-6' />
									</motion.button>
								</div>
								<nav className='px-2 pt-2 pb-4 space-y-1'>
									{navItems.map((item, index) => (
										<motion.button
											key={item}
											initial={{ opacity: 0, x: 20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: 0.1 * (index + 1) }}
											onClick={() => handleSectionChange(item)}
											className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
												item === activeSection
													? `${isDark ? "text-white bg-[#2a2f3a]" : "text-gray-900 bg-gray-100"}`
													: `${
															isDark
																? "text-gray-300 hover:text-white hover:bg-[#2a2f3a]"
																: "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
													  }`
											}`}
											whileHover={{ x: 5 }}
											whileTap={{ scale: 0.98 }}>
											{item}
										</motion.button>
									))}
								</nav>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
