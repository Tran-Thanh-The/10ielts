import { DeepPartial } from "@/utils/types/deep-partial.type";
import { NullableType } from "@/utils/types/nullable.type";
import { IPaginationOptions } from "@/utils/types/pagination-options";
import { InvoiceProduct } from "../../domain/invoice-product";

export abstract class InvoiceProductRepository {
  abstract create(
    data: Omit<InvoiceProduct, "id" | "createdAt" | "updatedAt">,
  ): Promise<InvoiceProduct>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<InvoiceProduct[]>;

  abstract findById(
    id: InvoiceProduct["id"],
  ): Promise<NullableType<InvoiceProduct>>;

  abstract update(
    id: InvoiceProduct["id"],
    payload: DeepPartial<InvoiceProduct>,
  ): Promise<InvoiceProduct | null>;

  abstract remove(id: InvoiceProduct["id"]): Promise<void>;
}
