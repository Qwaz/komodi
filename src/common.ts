import {TypeInfo} from "./type";
export const EDIT_POINT_RADIUS = 6;

export const TRIANGLE_WIDTH = 12;
export const TRIANGLE_HEIGHT = 9;

export const FLOW_VERTICAL_MARGIN = 50;

export interface Offset {
    offsetX: number;
    offsetY: number;
}

export interface TypeRequirement {
    requiredType?: TypeInfo,
}

export interface TypedOffset extends Offset, TypeRequirement {
}
