import useSWR from "swr";
import fetcher from "./fetcher";
import { Decimal } from "@prisma/client/runtime/library";

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
  ];
};

type unitResponse = {
  units: [
    {
      id: string;
      unitName: string;
      unitAcronyms: string;
    }
  ];
};

type mapDataResponse = {
  map: {
    lat: Decimal;
    long: Decimal;
    zoom: number;
    fisheryAuthority: {
      id: string;
      fisheryAuthorityName: string;
      waterArea: {
        waterAreaName: string;
      };
    };
    Marker:
      | {
          id: string;
          info: string;
          lat: Decimal;
          long: Decimal;
          member: {
            user: {
              name: string | null;
              firstName: string | null;
              lastName: string | null;
              email: string | null;
            };
          };
          title: string;
          createdAt: Date;
        }[]
      | null;
  } | null;
};

type markerTypesResponse = {
  markerTypes: {
    id: string;
    type: string;
    markerURL: string;
  }[];
};

type markersResponse = {
  markers: {
    id: string;
    info: string;
    lat: Decimal;
    long: Decimal;
    member: {
      fisheryAuthority: {
        fisheryAuthorityName: string;
      };
      user: {
        name: string | null;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        image: string | null;
      };
    };
    markerType: {
      type: string;
      markerURL: string;
    };
    isAuthor: boolean;
    title: string;
    createdAt: Date;
  }[];
};

type markerDataResponse = {
  marker: {
    id: string;
    info: string;
    lat: Decimal;
    long: Decimal;
    mapId: string;
    title: string;
    markerType: {
      id: string;
      type: string;
    };
  } | null;
};

export function useWaterAreas(q: string) {
  return useSWR<waterAreaResponse>(
    `/api/waterAreaHandler/getAllWaterArea?name=${q}`,
    fetcher
  );
}

export function useCities(q: string) {
  return useSWR<cityResponse>(`/api/cityHandler/getAllCity?name=${q}`, fetcher);
}

export function useUsers(q: string) {
  return useSWR<userResponse>(`/api/userHandler/getUsers?name=${q}`, fetcher);
}

export function useAuthorities(q: string) {
  return useSWR<authorityResponse>(
    `/api/authorityHandler/getAuthorities?name=${q}`,
    fetcher
  );
}

export function useFishes() {
  return useSWR<fishResponse>("/api/fishHandler/getAllFish", fetcher);
}

export function useUnits(q: string) {
  return useSWR<unitResponse>(
    `/api/unitHandler/getAllUnitByType?type=${q}`,
    fetcher
  );
}

export function useMapById(q: string) {
  return useSWR<mapDataResponse>(
    `/api/mapHandler/getMapDataById?id=${q}`,
    fetcher,
    {
      onErrorRetry: (error) => {
        // Never retry on 404.
        if (error.status === 404) return;
      },
    }
  );
}

export function useMarkerTypes() {
  return useSWR<markerTypesResponse>(`/api/mapHandler/getMarkerTypes`, fetcher);
}

export function useMarkersByMap(q: string) {
  return useSWR<markersResponse>(
    `/api/mapHandler/getMarkerByMapId?id=${q}`,
    fetcher,
    {
      onErrorRetry: (error) => {
        // Never retry on 404.
        if (error.status === 404) return;
      },
    }
  );
}

export function useMarkerById(q: string) {
  return useSWR<markerDataResponse>(
    `/api/mapHandler/getMarkerDataById?id=${q}`,
    fetcher
  );
}

export function useAuthorityStat(q: string, p:string) {
  return useSWR<any>(
    `/api/statisticsHandler/getStatisticsByAuthority?authority=${q}&year=${p}`,
    fetcher,
    {
      onErrorRetry: (error) => {
        // Never retry on 404.
        if (error.status === 404) return;
        if (error.status === 204) return;
      },
    }
  );
}

export function useUserStat(q: string) {
  return useSWR<any>(
    `/api/statisticsHandler/getStatisticsByUser?year=${q}`,
    fetcher,
    {
      onErrorRetry: (error) => {
        // Never retry on 404.
        if (error.status === 404) return;
      },
    }
  );
}


export function useOwnAuthorities() {
  return useSWR<any>(
    `/api/authorityHandler/getOwnAuthorities`,
    fetcher,
    {
      onErrorRetry: (error) => {
        // Never retry on 404.
        if (error.status === 404) return;
      },
    }
  );
}