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
 * @interface CreateTaskData
 */
export interface CreateTaskData {
    /**
     * Название задания
     * @type {string}
     * @memberof CreateTaskData
     */
    title?: string;
    /**
     * Описание задачи
     * @type {string}
     * @memberof CreateTaskData
     */
    task?: string;
}

/**
 * Check if a given object implements the CreateTaskData interface.
 */
export function instanceOfCreateTaskData(value: object): value is CreateTaskData {
    return true;
}

export function CreateTaskDataFromJSON(json: any): CreateTaskData {
    return CreateTaskDataFromJSONTyped(json, false);
}

export function CreateTaskDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): CreateTaskData {
    if (json == null) {
        return json;
    }
    return {
        
        'title': json['title'] == null ? undefined : json['title'],
        'task': json['task'] == null ? undefined : json['task'],
    };
}

export function CreateTaskDataToJSON(json: any): CreateTaskData {
    return CreateTaskDataToJSONTyped(json, false);
}

export function CreateTaskDataToJSONTyped(value?: CreateTaskData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'title': value['title'],
        'task': value['task'],
    };
}

