const HeroSection = () => {
	return (
		<div className='relative w-full h-[300px] bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center'>
			{/* Placeholder for Lottie animation */}
			<div className='absolute inset-0 flex items-center justify-center opacity-20'>
				<div className='w-64 h-64 bg-white/10 rounded-full blur-2xl' />
			</div>

			<div className='text-center z-10'>
				<h1 className='text-4xl font-bold text-white mb-4'>Flights</h1>
			</div>
		</div>
	);
};

export default HeroSection;
