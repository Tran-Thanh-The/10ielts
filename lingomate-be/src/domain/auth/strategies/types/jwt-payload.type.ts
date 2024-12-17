import { Session } from "@/domain/session/domain/session";
import { User } from "@/domain/users/domain/user";

export type JwtPayloadType = Pick<User, "id" | "role"> & {
  sessionId: Session["id"];
  iat: number;
  exp: number;
  permissions: string[];
};
