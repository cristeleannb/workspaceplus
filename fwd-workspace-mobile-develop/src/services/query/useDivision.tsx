import {useQuery} from 'react-query';
import {DivisionService} from '../api/api.service';

import {QueryKeys} from './config';

export const useGetDivisionList = () => {
  return useQuery([QueryKeys.GET_DIVISION_LIST], () =>
    DivisionService.getWorkstationDivisionList(),
  );
};
