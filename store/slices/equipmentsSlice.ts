import { EquipmentResponseDto } from "@/dto/equipment.dto";
import { createSlice } from "@reduxjs/toolkit";
import {
  createEquipment,
  deleteEquipment,
  fetchEquipmentsByCategoryId,
} from "../thunks/fetchEquipments";

export interface EquipmentsState {
  equipments: EquipmentResponseDto[];
  isLoading: boolean;
  error: string | null;
  selectedEquipment: EquipmentResponseDto | null;
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
      state.equipments = action.payload as EquipmentResponseDto[];
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
      state.equipments.push(action.payload as EquipmentResponseDto);
      state.error = null;
    });
    builder.addCase(createEquipment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to create equipment";
      state.message = "";
    });

    // Delete equipment
    builder.addCase(deleteEquipment.pending, (state, action) => {
      state.isLoading = true;
      state.error = null;
      state.message = "";
    });
    builder.addCase(deleteEquipment.fulfilled, (state, action) => {
      state.isLoading = false;
      state.equipments = state.equipments.filter(
        (equipment) => equipment.id !== action.payload
      );
      state.error = null;
    });
    builder.addCase(deleteEquipment.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || "Failed to delete equipment";
      state.message = "";
    });
  },
});

export const equipmentsReducer = equipmentsSlice.reducer;
