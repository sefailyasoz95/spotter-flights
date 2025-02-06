import { useTheme } from "../Context/ThemeContext";
import Lottie from "lottie-react";
import flightAnimation from "../Assets/Animations/flight-animation.json";
import { motion } from "framer-motion";

export function ComingSoon() {
	const { theme } = useTheme();
	const isDark = theme === "dark";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.5 }}
			className='min-h-screen flex flex-col items-center justify-center'>
			<motion.div
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				transition={{
					type: "spring",
					stiffness: 260,
					damping: 20,
					delay: 0.2,
				}}
				className='w-64 h-64 mb-8'>
				<Lottie animationData={flightAnimation} loop={true} />
			</motion.div>
			<motion.h1
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className={`text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
				Coming Soon...
			</motion.h1>
			<motion.p
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className={`text-lg ${isDark ? "text-gray-400" : "text-gray-600"}`}>
				We're working on something exciting!
			</motion.p>
		</motion.div>
	);
}
