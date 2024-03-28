import useSWR from "swr";
import fetcher from "./fetcher";

type waterAreaResponse = {
    areas: [
      {
        id: string;
        waterAreaName: string;
      }
    ];
    message: string;
  };
  
  type cityResponse = {
    cities: [
      {
        id: string;
        cityName: string;
      }
    ];
    message: string;
  };

export function useWaterAreas(q:string){
    return useSWR<waterAreaResponse>(
        `/api/waterAreaHandler/getAllWaterArea?name=${q}`,
        fetcher
    );
}

export function useCities(q:string){
    return useSWR<cityResponse>(
        `/api/cityHandler/getAllCity?name=${q}`,
        fetcher
    );
}