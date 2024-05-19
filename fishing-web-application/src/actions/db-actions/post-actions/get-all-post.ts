"use server";

import { auth } from "@/auth";
import db from "@/lib/db";



type post = {
    member: {
        user: {
            name: string | null;
            firstName: string | null;
            lastName: string | null;
            email: string | null;
            image: string | null;
        };
    };
    fisheryAuthority: {
        id: string;
        fisheryAuthorityName: string;
    };
    isAuthor: Promise<boolean>;
    id: string;
    mainTitle: string;
    summary: string;
}[]

export async function getAllPost(
  page: string,
  search: string,
) {
  const currentPage = page ? page : 1;
  const currentRow = 12;
  const currentSearch = search ? search : "";

  const session = await auth()


  const skip = +currentPage * +currentRow - +currentRow;
  const take = +currentRow;

  const emptyPost: post = []

  try {

    const access = await db.access.findFirst({
      where: {
        user:{
          email: session?.user.email
        }
      }
    })

    const xdb = await db.$extends({
      result: {
        post:{
          isAuthor:{
              needs: { memberId:true, fisheryAuthorityId:true},
              async compute (post){
              
              const isOperator = await db.member.findFirst({
                where:{
                  user:{
                    email: session?.user.email,
                    role: "OPERATOR"
                  },
                  fisheryAuthorityId: post.fisheryAuthorityId
                }
              })

              const currentMember = await db.post.findFirst({
                    where:{ fisheryAuthorityId: post.fisheryAuthorityId, member:{user: {
                      OR:[{
                        role: "OPERATOR"
                      },{role: "INSPECTOR"}],
                      email: session?.user.email
                    }}}
                })
                return (post.memberId === currentMember?.memberId || Boolean(isOperator)) && Boolean(access?.accessToPost)
              }
          }
        }
      },
    });

    const posts = await xdb.post.findMany({
      where: {
        fisheryAuthority: {
          fisheryAuthorityName: {
            contains: currentSearch
          },
        },
      },
    
        select: {
          id: true,
          isAuthor:true,
          mainTitle:true,
          summary:true,
          member:{
            select:{
                user:{
                    select:{
                        name:true,
                        firstName:true,
                        lastName:true,
                        email:true,
                        image:true
                    }
                }
            }
          },
          fisheryAuthority: {
            select: {
                id:true,
                fisheryAuthorityName:true
            }
        }
        },
        skip: skip,
        take: take,
      })
    
      const numberOfPosts = await db.post.aggregate({
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

      

      return { posts: posts, numberOfPost: numberOfPosts._count.id };

  }catch(e){
    return { posts: emptyPost, numberOfPost: 0};
  }


  
}
