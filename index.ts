import { resolveMx } from "dns";
import * as Joi from "joi";

export interface EmailValidatorResult<T> extends Joi.ValidationResult<T> {
    host?: string;
}

/**
 * To verify whether it is a valid email or not
 * @param email Email id
 */
export function validateEmail(email: string): EmailValidatorResult<string>  {
    const schema = Joi.string().email();
    const result  = Joi.validate(email, schema);
    return result;
}

/**
 * To retrive the domain name from the valdiated email
 * @param email Email id
 */
export function getDomainFromEmail(email: string) {
    const data = validateEmail(email);
    if (data && data.error)
        return data;
    data.host = email.split("@")[1];
    return data;
}

/**
 * To validate the email host using DNS resolve MX
 * @param email Email id
 */
export function validate(email: string) {
    return new Promise((resolve, reject) => {
        const emailInfo = getDomainFromEmail(email);
        if (emailInfo && emailInfo.error)
            resolve(emailInfo.error);
        resolveMx(emailInfo.host, (err, data) => {
            if (err) {
                reject(err);
            }else {
                resolve(true);
            }
        });
    });
}