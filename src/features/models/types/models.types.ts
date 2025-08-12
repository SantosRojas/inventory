export interface Model {
  id: number;
  code: string;
  name: string;
}

export interface ModelsResponse {
  success: boolean;
  data: Model[];
}

export interface CreateModelRequest {
  code: string;
  name: string;
}

export interface UpdateModelRequest {
  id: number;
  code: string;
  name: string;
}

export interface ModelsState {
  models: Model[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedModel: Model | null;
}

export interface CreatedModelResponse {
    insertId: number;
}
