import { axiosClient } from "../Utils/axiosClient";

export interface FlightSearchParams {
	origin: string;
	destination: string;
	departureDate: string;
	returnDate?: string;
	adults?: number;
	children?: number;
	infants?: number;
	cabinClass?: "ECONOMY" | "BUSINESS" | "FIRST";
}

export interface FlightSearchResponse {
	data: {
		flights: Array<{
			id: string;
			price: {
				amount: number;
				currency: string;
			};
			segments: Array<{
				departure: {
					airport: {
						code: string;
						name: string;
					};
					time: string;
				};
				arrival: {
					airport: {
						code: string;
						name: string;
					};
					time: string;
				};
				duration: string;
				carrier: {
					name: string;
					code: string;
					logo: string;
				};
			}>;
			totalDuration: string;
			stopCount: number;
			co2Emissions: {
				amount: number;
				unit: string;
				comparisonToAverage: string;
			};
		}>;
		meta: {
			currency: string;
			total: number;
		};
	};
}

export interface FlightLegCarrier {
	id: number;
	logoUrl: string;
	name: string;
}

export interface FlightLocation {
	id: string;
	name: string;
	displayCode: string;
	city: string;
}

export interface FlightLeg {
	id: string;
	origin: FlightLocation;
	destination: FlightLocation;
	durationInMinutes: number;
	stopCount: number;
	departure: string;
	arrival: string;
	timeDeltaInDays: number;
	carriers: {
		marketing: FlightLegCarrier[];
	};
}

export interface Flight {
	id: string;
	price: {
		raw: number;
		formatted: string;
	};
	legs: Array<{
		id: string;
		origin: {
			id: string;
			name: string;
			displayCode: string;
			city: string;
		};
		destination: {
			id: string;
			name: string;
			displayCode: string;
			city: string;
		};
		durationInMinutes: number;
		stopCount: number;
		departure: string;
		arrival: string;
		timeDeltaInDays: number;
		carriers: {
			marketing: Array<{
				id: number;
				logoUrl: string;
				name: string;
			}>;
		};
	}>;
	tags: string[];
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

interface AirportSearchResponse {
	status: boolean;
	timestamp: number;
	data: Array<{
		skyId: string;
		entityId: string;
		presentation: {
			title: string;
			suggestionTitle: string;
			subtitle: string;
		};
		navigation: {
			entityId: string;
			entityType: string;
			localizedName: string;
			relevantFlightParams: {
				skyId: string;
				entityId: string;
				flightPlaceType: string;
				localizedName: string;
			};
		};
	}>;
}

interface APIResponse {
	status: boolean;
	timestamp: number;
	data: {
		context: {
			status: string;
			totalResults: number;
		};
		itineraries: Flight[];
	};
}

export const flightService = {
	searchAirports: async (query: string): Promise<Airport[]> => {
		try {
			const response = await axiosClient.get<AirportSearchResponse>("/flights/searchAirport", {
				params: {
					query,
					locale: "en-US",
				},
			});

			if (!response.data.status) {
				throw new Error("Failed to fetch airports");
			}

			return response.data.data.map((item) => ({
				id: item.entityId,
				name: item.presentation.title,
				displayCode: item.skyId,
				city: item.navigation.localizedName,
				parent: item.presentation.subtitle
					? {
							id: item.navigation.entityId,
							name: item.presentation.subtitle,
							displayCode: item.skyId,
							type: item.navigation.entityType,
					  }
					: undefined,
			}));
		} catch (error: any) {
			if (error.response?.data?.message) {
				const message = Array.isArray(error.response.data.message)
					? error.response.data.message.map((m: Record<string, string>) => Object.values(m)[0]).join(", ")
					: error.response.data.message;
				throw new Error(message);
			}
			console.error("Error fetching airports:", error);
			throw error;
		}
	},

	searchFlights: async (params: {
		origin: Airport;
		destination: Airport;
		departureDate: string;
		returnDate?: string;
		adults: number;
		children: number;
		infants: number;
		cabinClass: "ECONOMY" | "BUSINESS" | "FIRST";
	}): Promise<Flight[]> => {
		try {
			const response = await axiosClient.get<APIResponse>("/flights/searchFlights", {
				params: {
					originSkyId: params.origin.displayCode,
					destinationSkyId: params.destination.displayCode,
					originEntityId: params.origin.parent?.id || params.origin.id,
					destinationEntityId: params.destination.parent?.id || params.destination.id,
					date: params.departureDate,
					returnDate: params.returnDate,
					adults: params.adults.toString(),
					children: params.children.toString(),
					infants: params.infants.toString(),
					cabinClass: params.cabinClass.toLowerCase(),
					sortBy: "best",
					currency: "USD",
					market: "en-US",
					countryCode: "US",
				},
			});

			if (!response.data.status) {
				throw new Error("Failed to fetch flights");
			}

			return response.data.data.itineraries;
		} catch (error: any) {
			if (error.response?.data?.message) {
				const message = Array.isArray(error.response.data.message)
					? error.response.data.message.map((m: Record<string, string>) => Object.values(m)[0]).join(", ")
					: error.response.data.message;
				throw new Error(message);
			}
			console.error("Error fetching flights:", error);
			throw error;
		}
	},
};
