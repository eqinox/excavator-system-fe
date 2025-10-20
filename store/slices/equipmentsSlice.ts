import { EquipmentReponseDataDto } from "@/dto/server/equipment.dto";
import { createSlice } from "@reduxjs/toolkit";
import {
  createEquipment,
  fetchEquipmentsByCategoryId,
} from "../thunks/fetchEquipments";

export interface EquipmentsState {
  equipments: EquipmentReponseDataDto[];
  isLoading: boolean;
  error: string | null;
  selectedEquipment: EquipmentReponseDataDto | null;
  message: string;
}

const initialState: EquipmentsState = {
  equipments: [],
  isLoading: false,
  error: null,
  selectedEquipment: null,
  message: "",
};

export const equipmentsSlice = createSlice({
  name: "equipments",
  initialState,
  reducers: {},
  extraReducers(builder) {
    // Fetch equipments
    builder.addCase(fetchEquipmentsByCategoryId.pending, (state, action) => {
      state.isLoading = true;
      state.equipments = [];
      state.error = null;
      state.message = "";
    });
    builder.addCase(fetchEquipmentsByCategoryId.fulfilled, (state, action) => {
      state.isLoading = false;
      state.equipments = action.payload;
      state.error = null;
    });
    builder.addCase(fetchEquipmentsByCategoryId.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to fetch equipments";
      state.message = "";
    });

    // Create equipment
    builder.addCase(createEquipment.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.message = "";
    });
    builder.addCase(createEquipment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.equipments.push(action.payload.data);
      state.message = action.payload.message;
      state.error = null;
    });
    builder.addCase(createEquipment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to create equipment";
      state.message = "";
    });
  },
});

export const equipmentsReducer = equipmentsSlice.reducer;
