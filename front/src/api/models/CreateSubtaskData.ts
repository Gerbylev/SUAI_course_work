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
 * @interface CreateSubtaskData
 */
export interface CreateSubtaskData {
    /**
     * 
     * @type {string}
     * @memberof CreateSubtaskData
     */
    text?: string;
}

/**
 * Check if a given object implements the CreateSubtaskData interface.
 */
export function instanceOfCreateSubtaskData(value: object): value is CreateSubtaskData {
    return true;
}

export function CreateSubtaskDataFromJSON(json: any): CreateSubtaskData {
    return CreateSubtaskDataFromJSONTyped(json, false);
}

export function CreateSubtaskDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateSubtaskData {
    if (json == null) {
        return json;
    }
    return {
        
        'text': json['text'] == null ? undefined : json['text'],
    };
}

export function CreateSubtaskDataToJSON(json: any): CreateSubtaskData {
    return CreateSubtaskDataToJSONTyped(json, false);
}

export function CreateSubtaskDataToJSONTyped(value?: CreateSubtaskData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'text': value['text'],
    };
}

