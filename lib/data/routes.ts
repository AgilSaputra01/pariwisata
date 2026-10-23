import { FastboatRoute } from "@/types";
import routes from "./routes.json";

export const getRoutes = (lang: string = "id"): FastboatRoute[] => {
  return routes.map((route: any) => {
    const translation = route.translations[lang] || route.translations['en'] || route.translations['id'];
    
    return {
      id: route.id,
      departurePort: route.departurePort,
      arrivalPort: route.arrivalPort,
      destinationName: route.destinationName,
      durationMinutes: route.durationMinutes,
      pricePerPerson: route.pricePerPerson,
      childPrice: route.childPrice,
      schedules: route.schedules,
      operators: route.operators,
      included: translation.included,
      popular: route.popular,
      image: route.image,
    };
  });
};

export const POPULAR_ROUTES = getRoutes("id");
