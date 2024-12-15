import { NullableType } from "../../../utils/types/nullable.type";
import { FileType } from "../../domain/file";

export abstract class FileRepository {
  abstract create(data: Omit<FileType, "id">): Promise<FileType>;
  abstract delete(id: FileType["id"]): Promise<void>;

  abstract findById(id: FileType["id"]): Promise<NullableType<FileType>>;
}
