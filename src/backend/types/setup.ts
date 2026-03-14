export type SetupCategory = "hardware" | "peripherals" | "software";

export interface SetupItem {
  id: string;
  category: SetupCategory;
  label: string;
  value: string;
}