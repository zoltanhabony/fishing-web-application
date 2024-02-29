import {useEffect, useLayoutEffect} from 'react';

export const useSidebarLayoutEffect =
   typeof window !== 'undefined' ? useLayoutEffect : useEffect;