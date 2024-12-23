/* tslint:disable */
/* eslint-disable */
/**
 * Контракт для ОП
 * API для работы с заданиями и тетрадками для нашего маленького (пока ещё!) подобия Stepik. Здесь находится наш скромный функционал, выраженный в возможности создать новые задания, получить всю возможную информацию об уже имеющемся задании по его идентификатору, а также тут происходит связь \"учитель - студент\", когда ученик высылает своё решение (также по идентификатору).
 *
 * The version of the OpenAPI document: Pre-alpha
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface PromptData
 */
export interface PromptData {
    /**
     * 
     * @type {string}
     * @memberof PromptData
     */
    prompt?: string;
}

/**
 * Check if a given object implements the PromptData interface.
 */
export function instanceOfPromptData(value: object): value is PromptData {
    return true;
}

export function PromptDataFromJSON(json: any): PromptData {
    return PromptDataFromJSONTyped(json, false);
}

export function PromptDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): PromptData {
    if (json == null) {
        return json;
    }
    return {
        
        'prompt': json['prompt'] == null ? undefined : json['prompt'],
    };
}

export function PromptDataToJSON(json: any): PromptData {
    return PromptDataToJSONTyped(json, false);
}

export function PromptDataToJSONTyped(value?: PromptData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'prompt': value['prompt'],
    };
}

