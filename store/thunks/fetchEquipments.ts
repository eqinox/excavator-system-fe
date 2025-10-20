import {
  AllEquipmentsResponseDto,
  EquipmentReponseDto,
} from "@/dto/server/equipment.dto";
import { assertNoError } from "@/lib/helpers";
import { EquipmentFormData } from "@/validation/equipment";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { apiSlice } from "../slices/apiSlice";

const fetchEquipmentsByCategoryId = createAsyncThunk(
  "equipments/fetchByCategoryId",
  async (categoryId: string, { dispatch }) => {
    const result = (await dispatch(
      apiSlice.endpoints.authenticatedGet.initiate(
        `/equipment/category/${categoryId}`
      )
    )) as { data: AllEquipmentsResponseDto } | { error: FetchBaseQueryError };

    assertNoError(result, "An error occurred during fetch equipments");
    if (result.data.statusCode >= 200 && result.data.statusCode < 300) {
      return result.data.data;
    } else {
      throw new Error(result.data.message);
    }
  }
);

const createEquipment = createAsyncThunk(
  "equipments/create",
  async (
    {
      data,
      onSuccess,
      onError,
    }: {
      data: Omit<EquipmentFormData, "price_per_day"> & {
        price_per_day: number;
        category_id: string;
      };
      onSuccess?: (message: string) => void;
      onError?: (message: string) => void;
    },
    { dispatch }
  ) => {
    const result = (await dispatch(
      apiSlice.endpoints.authenticatedPost.initiate({
        url: "/equipment",
        data,
      })
    )) as { data: EquipmentReponseDto } | { error: FetchBaseQueryError };

    assertNoError(result, "An error occurred during create equipment");

    if (result.data.statusCode >= 200 && result.data.statusCode < 300) {
      onSuccess?.(result.data.message);
      return result.data;
    } else {
      onError?.(result.data.message);
      throw new Error(result.data.message);
    }
  }
);

export { createEquipment, fetchEquipmentsByCategoryId };
