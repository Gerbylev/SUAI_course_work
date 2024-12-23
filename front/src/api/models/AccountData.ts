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
 * @interface AccountData
 */
export interface AccountData {
    /**
     * 
     * @type {string}
     * @memberof AccountData
     */
    username?: string;
    /**
     * 
     * @type {string}
     * @memberof AccountData
     */
    fullName?: string;
    /**
     * 
     * @type {number}
     * @memberof AccountData
     */
    solvedTasks?: number;
}

/**
 * Check if a given object implements the AccountData interface.
 */
export function instanceOfAccountData(value: object): value is AccountData {
    return true;
}

export function AccountDataFromJSON(json: any): AccountData {
    return AccountDataFromJSONTyped(json, false);
}

export function AccountDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): AccountData {
    if (json == null) {
        return json;
    }
    return {
        
        'username': json['username'] == null ? undefined : json['username'],
        'fullName': json['full_name'] == null ? undefined : json['full_name'],
        'solvedTasks': json['solved_tasks'] == null ? undefined : json['solved_tasks'],
    };
}

export function AccountDataToJSON(json: any): AccountData {
    return AccountDataToJSONTyped(json, false);
}

export function AccountDataToJSONTyped(value?: AccountData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'username': value['username'],
        'full_name': value['fullName'],
        'solved_tasks': value['solvedTasks'],
    };
}

