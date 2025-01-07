import { RootState } from '@/stores/store';
import { Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ProtectByPremissions({
  permissions,
  children,
  needAll = true,
}: {
  permissions: string[];
  children: React.ReactNode;
  needAll?: boolean;
}) {
  const token = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const [access, setAccess] = React.useState<boolean>(false);

  useEffect(() => {
    try {
      if (user?.role?.name === "Admin") {
        setAccess(true);
        return;
      }
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
  }, [token, needAll, user?.role?.name]);
  return access ? <>{children}</> : null;
}
