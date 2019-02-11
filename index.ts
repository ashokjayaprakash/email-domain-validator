import { resolveMx } from "dns";
import * as Joi from "joi";

export interface EmailValidatorResult<T> extends Joi.ValidationResult<T> {
    host?: string;
}

export interface EmailDomainValidatorResponse {
    isValidDomain: boolean
    erorrMessage?: Array<string>
    invalidEmailList?: Array<string>
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
                const domainValidatorResponse = parseMXResponse(response);
                return resolve(domainValidatorResponse);
            })
            .catch((e) => {
                return reject(e);                
            });    
    });
}

/**
 * Parse dns respose
 */
function parseMXResponse(mxResponse: any){
    let data: EmailDomainValidatorResponse = {
        isValidDomain: true,
        erorrMessage: [],
        invalidEmailList: []
    };

    for(let r of mxResponse) {
        if(r instanceof Error) {
            const mxErrorResponse = JSON.parse(r.message);
            data.isValidDomain = false;
            data.invalidEmailList.push(mxErrorResponse.emailId);
            data.erorrMessage.push(mxErrorResponse.message);
        }
    }
    return data;
}


/**
 * Promise to validate mail exchange
 * @param email 
 */
function validateMailExchange(emailId: string) {
    return new Promise((resolve, reject) => {

        let errorObj =  {
            emailId,
            message: ""
        };

        //Domain validation
        const emailInfo = getEmailDomain(emailId);
        if (emailInfo && emailInfo.error) {
            if(emailInfo.error.message){
                errorObj.message = `${ emailInfo.error.message.replace('value', emailId) }`;                
            } else {
                errorObj.message = `${emailId} " - " ${emailInfo.error.message}`;
            }   
            const message = JSON.stringify(errorObj);            
            return resolve(new Error(message));         
        }   
            
        //Validate Mail Exchange
        resolveMx(emailInfo.host, (err, data) => {
            if (err) {
                errorObj.message = `${emailId} - ${err.message}`;
                err.message = JSON.stringify(errorObj) ;
                return resolve(err);
            }else {
                return resolve(data);
            }
        });
    });
}