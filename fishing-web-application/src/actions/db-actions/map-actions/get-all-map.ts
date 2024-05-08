"use server";

import { auth } from "@/auth";
import db from "@/lib/db";
import { UserRole } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";


type map = {
  id: string;
  lat: Decimal;
  long: Decimal;
  isAuthor: Promise<Boolean>; 
  fisheryAuthority: {
      id: string;
      fisheryAuthorityName: string;
      waterArea: {
          waterAreaName: string;
      };
      address: {
          streetName: string;
          streetNumber: number;
          floor: number | null;
          door: number | null;
          city: {
              cityName: string
          };
      };
  };
}[]

export async function getAllMap(
  page: string,
  search: string,
) {
  const currentPage = page ? page : 1;
  const currentRow = 12;
  const currentSearch = search ? search : "";

  const session = await auth()


  const skip = +currentPage * +currentRow - +currentRow;
  const take = +currentRow;

  const emptyMap: map = []

  try {

    const xdb = await db.$extends({
      result: {
        map:{
          isAuthor:{
              needs: { memberId:true, fisheryAuthorityId:true},
              async compute (map){
                  
              const currentMember = await db.map.findFirst({
                    where:{ fisheryAuthorityId: map.fisheryAuthorityId, member:{user: {
                      role: UserRole.OPERATOR,
                      email: session?.user.email
                    }}}
                })
                return map.memberId === currentMember?.memberId
              }
          }
        }
      },
    });

    const maps: map = await xdb.map.findMany({
      where: {
        fisheryAuthority: {
          fisheryAuthorityName: {
            contains: currentSearch
          },
        },
      },
    
        select: {
          id: true,
          lat:true,
          long:true,
          isAuthor:true,
          fisheryAuthority: {
            select: {
              id: true,
              fisheryAuthorityName: true,
              waterArea:{
                select: {
                    waterAreaName: true
                }
              },
              address: {
                select: {
                  streetName: true,
                  streetNumber: true,
                  floor: true,
                  door: true,
                  city: {
                    select: {
                      cityName: true,
                    },
                  },
                },
              },
            },
          },
        },
        skip: skip,
        take: take,
      })
    
      const numberOfMaps = await db.map.aggregate({
        where: {
          fisheryAuthority: {
            fisheryAuthorityName: {
              contains: currentSearch
            },
          },
        },
        _count: {
          id: true,
        },
      })

      

      return { maps: maps, numberOfMaps: numberOfMaps._count.id };

  }catch(e){
    return { maps: emptyMap, numberOfMaps: 0};
  }


  
}
