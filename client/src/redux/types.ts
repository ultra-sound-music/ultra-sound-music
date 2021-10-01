import { IConfigsState } from './configs/reducer';

export interface IRootState {
  configs: IConfigsState;
  [key: string]: unknown | Record<string, unknown>;
}
