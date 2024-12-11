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
 * @interface TokenData
 */
export interface TokenData {
    /**
     * 
     * @type {string}
     * @memberof TokenData
     */
    token?: string;
}

/**
 * Check if a given object implements the TokenData interface.
 */
export function instanceOfTokenData(value: object): value is TokenData {
    return true;
}

export function TokenDataFromJSON(json: any): TokenData {
    return TokenDataFromJSONTyped(json, false);
}

export function TokenDataFromJSONTyped(json: any, ignoreDiscriminator: boolean): TokenData {
    if (json == null) {
        return json;
    }
    return {
        
        'token': json['token'] == null ? undefined : json['token'],
    };
}

export function TokenDataToJSON(json: any): TokenData {
    return TokenDataToJSONTyped(json, false);
}

export function TokenDataToJSONTyped(value?: TokenData | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'token': value['token'],
    };
}
