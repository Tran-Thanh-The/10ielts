import { RootState } from '@/stores/store';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';

export default function useHasPermissons({
  permissions,
  needAll = true,
}: {
  permissions: string[];
  needAll?: boolean;
}) {
  const token = useSelector((state: RootState) => state.auth.token);
  const [access, setAccess] = React.useState<boolean>(false);

  useEffect(() => {
    try {
      const decoded: any = jwtDecode(token);
      if (needAll) {
        const hasAll = permissions.every((permisson) =>
          decoded.permissions.includes(permisson),
        );
        setAccess(hasAll);
      } else {
        const hasOne = permissions.some((permisson) =>
          decoded.permissions.includes(permisson),
        );
        setAccess(hasOne);
      }
    } catch (error) {
      setAccess(false);
      console.error('Error decoding token:', error);
    }
  }, [token, needAll]);

  return access;
}
