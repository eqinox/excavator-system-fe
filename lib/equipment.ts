import { apiClient } from './api';
import {
  EquipmentReponseDataDto,
  EquipmentReponseDto,
} from './dto/server/equipment.dto';

export const getEquipmentById = async (id: string) => {
  const response = await apiClient.authenticatedRequest<EquipmentReponseDto>(
    `/equipment/${id}`,
    {
      method: 'GET',
    }
  );
  return response;
};

export const createEquipment = async (equipment: EquipmentReponseDataDto) => {
  const response = await apiClient.authenticatedRequest<EquipmentReponseDto>(
    '/equipment',
    {
      method: 'POST',
      body: JSON.stringify(equipment),
    }
  );
  return response;
};
