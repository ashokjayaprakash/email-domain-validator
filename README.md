**email-domain-validator**

NMP module to validate email host & mail exchange using DNS protocol.

[![npm version](https://badge.fury.io/js/email-domain-validator.svg)](https://badge.fury.io/js/email-domain-validator) [![Build Status](https://travis-ci.org/ashokjayaprakash/email-domain-validator.svg?branch=master)](https://travis-ci.org/ashokjayaprakash/email-domain-validator)

**Features**
1. Email host mail exchange (MX) validation using DNS protocol.
2. Email address string validation using JOI

(Supports Typescript without any additional type definitions)

```javascript
//Code snippet for Javascript 
const EmailDomainValidator = require("email-domain-validator");

// To validate multiple email id give input as comma seperated string "test@test.com, xyz@abc.com"
EmailDomainValidator.validate("test@test.com")
	.then(function(data){
		console.log(data);
	})
	.catch(function(err){
		console.log("ERR: ", err);
	});
//Code snippet for Typescript
import { validate } from"email-domain-validator";
validate("test@test.com")
	.then(function(data){
		console.log(data);
	})
	.catch(function(err){
		console.log("ERR: ", err);
	});
```