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
 * @interface TaskData
 */
export interface TaskData {
    /**
     * Идентификатор задания
     * @type {string}
     * @memberof TaskData
     */
    id?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskData
     */
    title?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskData
     */
    task?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskData
     */
    author?: string;
    /**
     * 
     * @type {string}
     * @memberof TaskData
     */
    solved?: string;
    /**
     * 
     * @type {boolean}
     * @memberof TaskData
     */
    isAnalyzed?: boolean;
}

/**
 * Check if a given object implements the TaskData interface.
 */
export function instanceOfTaskData(value: object): value is TaskData {
    return true;
}

export function TaskDataFromJSON(json: any): TaskData {
    return TaskDataFromJSONTyped(json, false);
}

export function TaskDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): TaskData {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'title': json['title'] == null ? undefined : json['title'],
        'task': json['task'] == null ? undefined : json['task'],
        'author': json['author'] == null ? undefined : json['author'],
        'solved': json['solved'] == null ? undefined : json['solved'],
        'isAnalyzed': json['is_analyzed'] == null ? undefined : json['is_analyzed'],
    };
}

export function TaskDataToJSON(json: any): TaskData {
    return TaskDataToJSONTyped(json, false);
}

export function TaskDataToJSONTyped(value?: TaskData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'title': value['title'],
        'task': value['task'],
        'author': value['author'],
        'solved': value['solved'],
        'is_analyzed': value['isAnalyzed'],
    };
}
