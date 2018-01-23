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
export function getEmailDomain(email: string) {
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
export function validate(email: string = "") {
    return new Promise((resolve, reject) => {
        let emailList =email.split(",");
        let promiseList = [];
        for(let email of emailList) {
            promiseList.push(validateMailExchange(email.trim()));
        }    
        Promise.all(promiseList)
            .then((response) => {
                resolve(true);
            })
            .catch((e) => {
                reject(e);
            });    
    });
}

/**
 * Promise to validate mail exchange
 * @param email 
 */
function validateMailExchange(email: string) {
    return new Promise((resolve, reject) => {
        //Domain validation
        const emailInfo = getEmailDomain(email);
        if (emailInfo && emailInfo.error) {
            if(emailInfo.error.message){
                emailInfo.error.message = `${ emailInfo.error.message.replace("value", email) }`;                
            } else {
                emailInfo.error.message = `${email} " - " ${emailInfo.error.message}`;
            }   
            return reject(emailInfo.error.message);         
        }
            
        //Validate Mail Exchange
        resolveMx(emailInfo.host, (err, data) => {
            if (err) {
                return reject(`${email} - ${err.message}`);
            }else {
                return resolve(true);
            }
        });
    });
}

validate("ashokjp@gmail.com")
    .then((data) => {
        console.log(data);        
    })
    .catch((err) => {
        console.log("ERR : ", err);        
    });