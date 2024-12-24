import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { Invoice } from "../../domain/invoice";

export abstract class InvoiceRepository {
  abstract create(
    data: Omit<Invoice, "id" | "createdAt" | "updatedAt" | "deletedAt">,
  ): Promise<Invoice>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Invoice[]>;

  abstract findById(id: Invoice["id"]): Promise<NullableType<Invoice>>;

  abstract update(
    id: Invoice["id"],
    payload: DeepPartial<Invoice>,
  ): Promise<Invoice | null>;

  abstract remove(id: Invoice["id"]): Promise<void>;

  abstract updateByOrderCode(
    orderCode: number | string,
    data: Partial<Invoice>,
  );

  abstract findByOrderCode(
    orderCode: number | string,
  ): Promise<NullableType<Invoice>>;
}
