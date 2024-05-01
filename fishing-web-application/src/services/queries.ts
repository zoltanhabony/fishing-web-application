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

  type userResponse = {
    users: [
      {
        id: string;
        name: string;
      }
    ];
    message: string;
  };

  type authorityResponse = {
    authorities: [
      {
        id: string;
        fisheryAuthorityName: string;
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

  type fishResponse = {
    fishes: [
      {
        id: string;
        fishName: string;
      }
    ]
  }

  type unitResponse = {
    units: [
      {
        id: string;
        unitName: string;
        unitAcronyms: string;
      }
    ]
  }

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

export function useUsers(q:string){
  return useSWR<userResponse>(
      `/api/userHandler/getUsers?name=${q}`,
      fetcher
  );
}

export function useAuthorities(q:string){
  return useSWR<authorityResponse>(
      `/api/authorityHandler/getAuthorities?name=${q}`,
      fetcher
  );
}

export function useFishes(){
  return useSWR<fishResponse>(
      "/api/fishHandler/getAllFish",
      fetcher
  );
}

export function useUnits(q:string){
  return useSWR<unitResponse>(
      `/api/unitHandler/getAllUnitByType?type=${q}`,
      fetcher
  );
}