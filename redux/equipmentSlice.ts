import { EquipmentReponseDataDto } from '@/lib/dto/server/equipment.dto';
import { getEquipmentById } from '@/lib/equipment';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const GET_EQUIPMENT_BY_ID = 'GET_EQUIPMENT_BY_ID';

interface EquipmentState {
  equipments?: EquipmentReponseDataDto[];
  loading: boolean;
  error: string | null;
  selectedEquipment: EquipmentReponseDataDto | null;
}

const initialState: EquipmentState = {
  loading: false,
  error: null,
  selectedEquipment: null,
};

export const fetchEquipmentById = createAsyncThunk<
  EquipmentReponseDataDto,
  string
>(GET_EQUIPMENT_BY_ID, async (id: string) => {
  const response = await getEquipmentById(id);

  return response.data;
});

const equipmentSlice = createSlice({
  name: 'equipment',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchEquipmentById.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEquipmentById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedEquipment = action.payload;
      })
      .addCase(fetchEquipmentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch equipment';
      });
  },
});

export default equipmentSlice.reducer;
