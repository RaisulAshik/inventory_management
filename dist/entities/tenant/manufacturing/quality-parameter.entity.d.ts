export declare enum QualityParameterType {
    NUMERIC = "NUMERIC",
    BOOLEAN = "BOOLEAN",
    TEXT = "TEXT",
    RANGE = "RANGE",
    OPTIONS = "OPTIONS"
}
export declare class QualityParameter {
    id: string;
    parameterCode: string;
    parameterName: string;
    description: string;
    parameterType: QualityParameterType;
    unitOfMeasure: string;
    minValue: number;
    maxValue: number;
    targetValue: number;
    allowedOptions: string[];
    isCritical: boolean;
    isActive: boolean;
    inspectionMethod: string;
    samplingInstructions: string;
    createdAt: Date;
    updatedAt: Date;
    isValueWithinLimits(value: number): boolean;
}
