import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import { isGuardian } from 'utils/roles';

import authActions from 'shared/Auth/actions';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import {
  convertValueToUrlParam,
  getCurrentSchoolYear,
  setCurrentSchoolYear,
  setUrlParam,
} from 'utils';

function useGetSchoolYear() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const authContext = useAuthDataContext();
  const { currentStudentId, currentUser } = authContext;
  const { organizationId } = currentUser;
  const searchParams = new URLSearchParams(location.search);

  const schoolYears = useSelector((state) => state.Auth.schoolYears) ?? [];
  const schoolYearSelected = useSelector(
    (state) => state.Auth.schoolYearSelected
  );
  const setParamSchoolYear = (schoolYear, type) => {
    setUrlParam(
      location,
      history,
      {
        schoolYearId: schoolYear?.id,
        schoolYear: convertValueToUrlParam(schoolYear?.name),
      },
      type
    );
  };
  const setSchoolYearSelected = (schoolYearId) => {
    const schoolYearItem = schoolYears.find((e) => e.id === schoolYearId);
    if (schoolYearItem?.id) {
      dispatch(
        authActions.authSetState({
          schoolYearSelected: schoolYearId,
        })
      );
      setCurrentSchoolYear(schoolYearItem);
      setParamSchoolYear(schoolYearItem, 'replace');
    }
  };
  
  const setFilterSchoolYear = (schoolYearId) => {
    const schoolYearItem = schoolYears.find((e) => e.id === schoolYearId);
    if (schoolYearItem?.id) {
      dispatch(
        authActions.authSetState({
          schoolYearSelected: schoolYearId,
        })
      );
    }
  };
  const resetSchoolYear = () => {
    const currentSchoolYear = getCurrentSchoolYear(schoolYears);

    dispatch(
      authActions.authSetState({
        schoolYearSelected: currentSchoolYear?.id || -1,
      })
    );
  };
  useEffect(() => {
    dispatch(
      authActions.getCurrentUserSchoolYears({
        orgId: organizationId,
        userId:
          !!currentStudentId && isGuardian(currentUser)
            ? currentStudentId
            : currentUser?.id,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useDidMountEffect(() => {
    if (schoolYears.length > 0) {
      const currentSchoolYear = getCurrentSchoolYear(schoolYears);
      const schoolYearItem = searchParams.get('schoolYearId')
        ? Number(searchParams.get('schoolYearId'))
        : Number(currentSchoolYear.id);

      const schoolYearTmp = schoolYearItem || schoolYears[0].id;
      dispatch(
        authActions.authSetState({
          schoolYearSelected: schoolYearTmp,
        })
      );
    }
  }, [schoolYears]);
  return [schoolYearSelected, setSchoolYearSelected , setFilterSchoolYear ,resetSchoolYear];
}

export const withHooksGetSchoolYear = (Component) => (props) => {
    const [schoolYearSelected, setSchoolYearSelected] = useGetSchoolYear();

    return (
      <Component
        schoolYearSelected={schoolYearSelected}
        setSchoolYearSelected={setSchoolYearSelected}
        {...props}
      />
    );
  };

export default useGetSchoolYear;
