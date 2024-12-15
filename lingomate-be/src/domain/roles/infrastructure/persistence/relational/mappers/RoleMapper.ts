
// import { RoleEnum } from "@/common/enums/roles.enum";
// import { RoleDto } from "@/domain/roles/dto/role.dto";

// export class RoleMapper {
//   static mapRoleNameToRoleEnum(roleName: string): RoleEnum {
//     const roleEnum = RoleEnum[roleName as keyof typeof RoleEnum];
//     if (roleEnum === undefined) {
//       throw new Error(`Không thể ánh xạ tên role "${roleName}" về RoleEnum.`);
//     }
//     return roleEnum;
//   }

//   static mapRoleEnumToRoleDto(roleEnum: RoleEnum): RoleDto {
//     const roleDto = new RoleDto();

//     roleDto.id = getRoleIdByEnum(roleEnum);
//     roleDto.name = RoleEnum[roleEnum] as string;

//     return roleDto;
//   }

//   static mapRoleDtoToRoleEnum(roleDto: RoleDto): RoleEnum {
//     const roleEnum = RoleEnum[roleDto.name as keyof typeof RoleEnum];
//     if (roleEnum === undefined) {
//       throw new Error(
//         `Không thể ánh xạ tên role "${roleDto.name}" về RoleEnum.`,
//       );
//     }

//     return roleEnum;
//   }
// }

// function getRoleIdByEnum(roleEnum: RoleEnum): number {
//   switch (roleEnum) {
//     case RoleEnum.admin:
//       return 1;
//     case RoleEnum.staff:
//       return 2;
//     case RoleEnum.user:
//       return 3;
//     case RoleEnum.teacher:
//       return 4;
//     default:
//       return 0;
//   }
// }
